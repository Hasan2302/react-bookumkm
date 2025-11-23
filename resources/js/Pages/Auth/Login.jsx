import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2, Mail, Lock, Eye, EyeOff, Calendar, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />

            {/* Clean White Background - Minimalist */}
            <div className="relative flex items-center justify-center min-h-screen px-4 py-8 bg-white sm:px-6 lg:px-8">
                
                {/* Back to Home */}
                <Link 
                    href="/"
                    className="absolute flex items-center gap-2 text-sm font-medium transition-colors top-4 left-4 sm:top-6 sm:left-6 text-gray-600 hover:text-primary-600"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Kembali</span>
                </Link>

                <div className="w-full max-w-md">
                    {/* Minimalist Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm">
                        {/* Content */}
                        <div className="p-6 sm:p-8 lg:p-10">
                            {/* Logo & Title - Minimalist */}
                            <div className="mb-6 sm:mb-8 text-center">
                                {/* Simple Logo */}
                                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-2xl bg-primary-600">
                                    <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                
                                <h1 className="mb-1 sm:mb-2 text-2xl sm:text-3xl font-bold text-gray-900">
                                    Masuk
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Masuk ke akun BookUMKM Anda
                                </p>
                            </div>

                            {/* Status Message - Simple */}
                            {status && (
                                <div className="p-3 sm:p-4 mb-4 sm:mb-6 text-xs sm:text-sm font-medium text-center text-green-700 bg-green-50 border border-green-200 rounded-xl">
                                    {status}
                                </div>
                            )}

                            {/* Form - Minimalist */}
                            <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                                {/* Email Field - Simple */}
                                <div>
                                    <label htmlFor="email" className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            autoComplete="username"
                                            autoFocus
                                            required
                                            className="w-full py-2.5 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base transition-colors border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400"
                                            placeholder="nama@email.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs sm:text-sm font-medium text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Field - Simple */}
                                <div>
                                    <label htmlFor="password" className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-semibold text-gray-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                                            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            autoComplete="current-password"
                                            required
                                            className="w-full py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base transition-colors border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-gray-400 transition-colors hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                            ) : (
                                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs sm:text-sm font-medium text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password - Mobile Optimized */}
                                <div className="flex items-center justify-between gap-2">
                                    <label className="flex items-center group">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-4 h-4 transition-colors border border-gray-300 rounded text-primary-600 focus:ring-2 focus:ring-primary-500"
                                        />
                                        <span className="ml-2 text-xs sm:text-sm font-medium text-gray-600">
                                            Ingat saya
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs sm:text-sm font-semibold transition-colors text-primary-600 hover:text-primary-700 hover:underline"
                                        >
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>

                                {/* Submit Button - Clean */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white transition-all duration-300 bg-primary-600 rounded-xl hover:bg-primary-700 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                            Sedang masuk...
                                        </span>
                                    ) : (
                                        'Masuk'
                                    )}
                                </button>
                            </form>

                            {/* Divider - Simple */}
                            <div className="relative my-5 sm:my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs sm:text-sm">
                                    <span className="px-3 sm:px-4 text-gray-500 bg-white">atau</span>
                                </div>
                            </div>

                            {/* Footer Links - Simple */}
                            <div className="text-center">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Belum punya akun?{' '}
                                    <Link
                                        href={route('register')}
                                        className="font-bold transition-colors text-primary-600 hover:text-primary-700 hover:underline"
                                    >
                                        Daftar sekarang
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
