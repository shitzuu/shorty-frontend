import React, {useState} from "react"
import {toast, ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import {createShortcut, CreationOutcome} from "@/app/shortcut/ShortcutController"
import {ShortcutDto} from "@/app/shortcut/ShortcutDto"

export default function CreateShortcutPage(): React.JSX.Element {
    const handleSubmit = async (source: string, target: string): Promise<void> => {
        if ((await createShortcut(new ShortcutDto(source, target))).answer === CreationOutcome.CREATED) {
            displayNotification('Shortcut created successfully', 'success')
        } else {
            displayNotification('Failed to create shortcut', 'error')
        }
    }

    const displayNotification = (message: string, type: 'success' | 'error'): void => {
        toast[type](message)
    }

    return (
        <div>
            <div className="flex items-center justify-center h-screen">
                <div
                    className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Create
                        Shortcut</h5>
                    <Form onSubmit={handleSubmit}/>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false}
                            closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
        </div>
    )
}

interface FormProps {
    onSubmit: (source: string, target: string) => void
}

interface FormData {
    source: string
    target: string
}

interface FormValidation {
    pattern: RegExp
    errorMessage: string
}

const Form: React.FC<FormProps> = ({onSubmit}) => {
    const [formData, setFormData] = useState<FormData>({source: '', target: ''})
    const [formValidations] = useState<FormValidation[]>([
        {
            pattern: /^[a-zA-Z]{3,32}$/,
            errorMessage: 'Please enter a valid source (3-32 characters, letters only).',
        },
        {
            pattern: /^https?:\/\/.{1,128}$/,
            errorMessage: 'Please enter a valid target (starts with http:// or https:// and up to 128 characters).'
        }
    ])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        setFormData((prevData) => ({...prevData, [name]: value}))
    }

    const validateField = (fieldName: string, value: string): boolean => {
        const validation = formValidations.find((v) => v.pattern.test(value))
        return !!validation
    }

    const getFieldSymbol = (fieldName: string, value: string): React.ReactNode => {
        const isValid = validateField(fieldName, value)
        const symbolClass = `text-2xl ml-2 ${isValid ? 'text-green-500' : 'text-red-500'}`
        return <span className={`flex items-center ${symbolClass}`}>{isValid ? '✓' : '✕'}</span>
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSubmit(formData.source, formData.target)
    }

    return (
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="source">
                    Source:
                </label>
                <div className="flex">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                    />
                    {getFieldSymbol('source', formData.source)}
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="target">
                    Target:
                </label>
                <div className="flex">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        name="target"
                        value={formData.target}
                        onChange={handleChange}
                    />
                    {getFieldSymbol('target', formData.target)}
                </div>
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit">
                    Submit
                </button>
            </div>
        </form>
    )
}
