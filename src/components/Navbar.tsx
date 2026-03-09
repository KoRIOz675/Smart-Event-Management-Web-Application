import Link from "next/link";
import { getSessionUser, logoutUser } from "@/actions/user-actions";

export default async function Navbar() {
  const user = await getSessionUser(); 

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <Link href="/" className="text-2xl font-extrabold text-blue-600">
            SmartEvent
          </Link>
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/events" className="text-gray-600 hover:text-blue-600">Explorer</Link>
            {user && (
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-700">Hello, {user.full_name}</span>
                <form action={logoutUser}>
                  <button className="text-sm text-red-600 hover:underline">Déconnexion</button>
                </form>
                <Link 
                  href="/events/new" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  + Créer
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                  Connexion
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}