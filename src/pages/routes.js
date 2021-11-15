import * as Todo from './components/Todo'
import * as Post from './components/Post'

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