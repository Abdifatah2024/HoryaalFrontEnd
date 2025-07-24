import { Link } from "react-router-dom";
import { FiAlertTriangle, FiHome } from "react-icons/fi";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";

const Unauthorized = () => {
  const fullname = useSelector(
    (state: RootState) => state.loginSlice.data?.user?.fullname || ""
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full text-center transform transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 rounded-full">
            <FiAlertTriangle className="text-red-500 w-12 h-12 animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {fullname && <span className="text-red-500">{fullname}!</span>}         </h1>
        <p className="text-gray-600 mb-4 text-lg">
          Fadlan Ka taxadar isku daygan!, laguma ogalla inaad halkan timaado.
        </p>
        <div className="flex flex-col space-y-4">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
          >
            <FiHome className="w-5 h-5" />
            U laabo Bogga Hore
          </Link>
          <Link
            to="/contact"
            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-200"
          >
            Ma u baahantahay rukhsad? La xiriir Maamulka Dugsiga.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

