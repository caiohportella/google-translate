import {
  clerkMiddleware,
  createRouteMatcher
} from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/translate"])

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) auth().protect()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/translate", "/(api|trpc)(.*)"],
}