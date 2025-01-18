import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function LoginForm({ userType }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url =
        userType === "candidate"
          ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/login`
          : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/login`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        console.log("Login Successful");
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error(
          `Login failed: ${errorData.message || "Unexpected error"}`
        );
      }
    } catch (err) {
      // <<<<<<< HEAD
      //       console.error(
      //         `Error: ${err.message}. Please check your network connection and try again.`
      //       );
      // =======
      console.error(
        `Error: ${err.message}. Please check your network connection and try again.`
      );
    } finally {
      setLoading(false);
      // >>>>>>> upstream/main
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your email"
          />
          <Mail className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            required
            className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your password"
          />
          <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <label
            htmlFor="remember-me"
            className="block ml-2 text-sm text-gray-700"
          >
            Remember me
          </label>
        </div> */}
        <div className="text-sm">
          {/* <<<<<<< HEAD
          <a
            href="#"
            className="font-medium text-orange-500 hover:text-orange-600"
          >
            Forgot your password?
======= */}
          <a
            href="#"
            className="font-medium text-orange-500 hover:text-orange-600"
          >
            Forgot password?
            {/* >>>>>>> upstream/main */}
          </a>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        {loading ? <div className="spinner"></div> : "Log In"}
      </button>

      <p className="text-sm text-center text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-orange-500 hover:text-orange-600"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
