"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Register() {
    const { signup, isLoading } = useAuth();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        country: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        try {
            await signup(
                formData.email, 
                formData.password,
                formData.first_name,
                formData.last_name,
                formData.phone_number,
                formData.country
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create account');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <AuthLayout 
            title="Create your account" 
            subtitle="Start your crypto journey today"
            type="register"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            First Name
                        </label>
                        <Input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Last Name
                        </label>
                        <Input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Email address
                    </label>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Phone Number
                    </label>
                    <Input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Country
                    </label>
                    <Input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Enter your country"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Password
                    </label>
                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Confirm Password
                    </label>
                    <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                    />
                </div>

                <div className="mt-2">
                    <label className="flex items-center">
                        <input 
                            type="checkbox" 
                            required
                            className="w-4 h-4 rounded border-gray-800 text-[#8B5CF6] focus:ring-[#8B5CF6]" 
                        />
                        <span className="ml-2 text-sm text-gray-400">
                            I agree to the{" "}
                            <a href="/terms" className="text-[#8B5CF6] hover:text-[#8B5CF6]/80">
                                Terms of Service
                            </a>
                            {" "}and{" "}
                            <a href="/privacy" className="text-[#8B5CF6] hover:text-[#8B5CF6]/80">
                                Privacy Policy
                            </a>
                        </span>
                    </label>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6"
                >
                    {isLoading ? "Creating account..." : "Create account"}
                </Button>
            </form>
        </AuthLayout>
    );
}