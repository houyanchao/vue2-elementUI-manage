import courseSource from './courseSource.js'
import teacher from './teacher.js'
import publicCourse from './openCourse.js'

const router = teacher.concat(courseSource, publicCourse)

export default router;
