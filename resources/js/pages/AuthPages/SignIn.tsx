import { Head } from '@inertiajs/react';
import SignInForm from '../../components/auth/SignInForm';
import AuthLayout from './AuthPageLayout';

export default function SignIn() {
    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="This is React.js Blank Dashboard page for TailAdmin" />
            </Head>
            <AuthLayout>
                <SignInForm />
            </AuthLayout>
        </>
    );
}
