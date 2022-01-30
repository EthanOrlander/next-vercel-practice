import { nonNull, objectType, stringArg, extendType, intArg, idArg } from 'nexus';
import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay';
import { prisma } from '@prisma/client';

export const ToDo = objectType({
    name: 'ToDo',
    definition(t) {
        t.string('id');
        t.int('index');
        t.string('title');
        t.string('description');
        t.string('project');
        t.boolean('done');
        t.string('dueDate');
    },
});

export const ToDosQuery = extendType({
    type: 'Query',
    definition(t) {
        t.connectionField('todos', {
            type: ToDo,
            additionalArgs: { after: intArg(), first: intArg() },
            resolve: async (_, { after, first }, ctx) => {
                const offset = after ? cursorToOffset(after) + 1 : 0;
                if (isNaN(offset)) throw new Error('cursor is invalid');

                const [totalCount, items] = await Promise.all([
                    ctx.prisma.toDo.count(),
                    ctx.prisma.toDo.findMany({
                        take: first,
                        skip: offset,
                    }),
                ]);

                return connectionFromArraySlice(
                    // items.map(item => ({
                    //     ...item,
                    //     date: item.dueDate.toString()
                    // })),
                    items,
                    { first, after },
                    { sliceStart: offset, arrayLength: totalCount }
                );
            },
        });
    },
});

export const ToDoQuery = extendType({
    type: 'Query',
    definition(t) {
        t.field('todo', {
            type: ToDo,
            args: { id: nonNull(idArg()) },
            resolve: async (_, { id }, ctx) => {
                return ctx.prisma.toDo.findUnique({ where: { id } });
            }
        });
    },
});

// TODO this mutation's return is not being cached properly -- the new todo doesn't show up in the todo page
export const CreateToDoMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createToDo', {
            type: 'ToDo',
            args: {
                title: nonNull(stringArg()),
                description: nonNull(stringArg()),
                dueDate: nonNull(stringArg()),
            },
            resolve: async (_root, { title, description, dueDate }, ctx) => {
                return ctx.prisma.toDo.create({ data: { title, description, dueDate: new Date(dueDate) } });
            }
        })
    },
});