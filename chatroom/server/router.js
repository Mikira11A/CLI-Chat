import path from "path"

class Router {
 constructor() {
   //this.prefix = path.join(import.meta.dirname, "..", "client")
   this.files = {}
 }
 registerFile(reqest_route, content_type, file_route) {
   this.files[reqest_route] = {
      content_type: content_type,
      file_route: file_route == undefined ? reqest_route : file_route
   }
 }
 checkFile(route) {
   return this.files[route] != undefined
 }
 getContentType(route) {
   return this.files[route]?.content_type
 }
 getFileRoute(route) {
   return this.files[route]?.file_route
 }
}
export default Router