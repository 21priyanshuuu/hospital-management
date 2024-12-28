import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();

  if (!(await isAuthenticated())) {
    return redirect(
      "/api/auth/login?post_login_redirect_url=http://localhost:3000/dashboard"
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-amber-300 to-orange-400">
      <h1 className="text-4xl font-bold text-pink-700 animate-fadeIn">
        Welcome, {user?.given_name || "Guest"}!
      </h1>
      <p className="text-lg text-gray-700 mt-4 animate-fadeIn">
        Discover new connections and find your perfect match with HeartLink.
      </p>
      <p className="text-lg text-gray-700 mt-2 animate-fadeIn">
        Swipe, match, and start a new adventure today!
      </p>
      <button className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-800 animate-bounce">
        Book Appointment
      </button>
    </div>
  );
}
