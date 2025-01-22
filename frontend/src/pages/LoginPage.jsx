import { useState } from 'react'
import { User, Building2 } from 'lucide-react'
import LoginForm from '../components/LoginForm'
import SocialAuthButtons from '../components/SocialAuthButtons'

function LoginPage() {
  const [userType, setUserType] = useState('candidate')

  return (
    <div className="container max-w-md px-4 py-12 mx-auto">
      <h1 className="mb-8 text-2xl font-semibold text-center">Login to Your Account</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setUserType('candidate')}
          className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors ${
            userType === 'candidate'
              ? 'border-orange-500 bg-orange-50 text-orange-600'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Candidate</span>
        </button>
        <button
          onClick={() => setUserType('employer')}
          className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors ${
            userType === 'employer'
              ? 'border-orange-500 bg-orange-50 text-orange-600'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span>Employer</span>
        </button>
      </div>

      <LoginForm userType={userType} />

      {userType === 'candidate' && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">Or continue with</span>
            </div>
          </div>

          <SocialAuthButtons />
        </div>
      )}
    </div>
  )
}

export default LoginPage

