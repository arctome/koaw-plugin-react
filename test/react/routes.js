import * as Todo from './Todo'
import * as Post from './Post'

export default [
    {
        path: '/todo',
        exact: true,
        component: Todo
    },
    {
        path: '/post',
        exact: true,
        component: Post
    }
]