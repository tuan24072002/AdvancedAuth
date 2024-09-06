import { Eye, EyeOff } from "lucide-react"

const Input = ({ icon: Icon, ...props }) => {
    return (
        <div className="relative mb-6 ">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon className='size-5 text-green-500' />
            </div>
            <input
                {...props}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
            />
            {
                props.placeholder === 'Password' &&
                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-white" onClick={() => props.setShowPassword(prev => !prev)}>
                    {
                        props.showPassword ? <EyeOff size={'1.2em'} /> : <Eye size={'1.2em'} />
                    }
                </div>
            }
        </div>
    )
}

export default Input