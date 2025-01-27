import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { signIn } from 'next-auth/react'
import { FaGithub, FaGoogle } from 'react-icons/fa'

const SocialLogin = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <>
            <Separator>
                <span className="px-2 text-sm text-gray-500">Or continue with</span>
            </Separator>

            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    onClick={() => signIn('google')}
                    disabled={isLoading}
                >
                    <FaGoogle className="h-5 w-5 mr-2 text-red-500" /> Google
                </Button>
                <Button
                    variant="outline"
                    onClick={() => signIn('github')}
                    disabled={isLoading}
                >
                    <FaGithub className="h-5 w-5 mr-2 text-gray-700" /> GitHub
                </Button>
            </div>
        </>
    )
}

export default SocialLogin;