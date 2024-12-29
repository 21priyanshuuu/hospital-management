import { connectDB } from '../../../lib/mongodb';
import AuthUser from '../../../models/AuthUser';
import DUser from '../../../models/UserModel';

// GET: Find user by email
export async function GET(req) {
    try {
        await connectDB(); // Ensure MongoDB connection

        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return new Response(
                JSON.stringify({ error: 'Email is required as a query parameter' }),
                { status: 400 }
            );
        }

        // Find user by email in AuthUser schema
        const user = await AuthUser.findOne({ email });

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'User not found with the given email' }),
                { status: 404 }
            );
        }

        // Return user details with default values
        return new Response(
            JSON.stringify({
                Id:user._id,
                userId: user.userId,
                name: user.name,
                username: user.username,
                email: user.email,
                phone: '', // Default empty
                wallet: 0, // Default wallet balance
                isAdmin: false, // Default isAdmin
                role: 'patient', // Default role
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('GET Error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}

// POST: Create a new user
export async function POST(req) {
    try {
        await connectDB(); // Ensure MongoDB connection

        const { userId, name, username, email, phone, wallet, isAdmin, role } = await req.json();

        // Validate role
        if (!['patient', 'doctor'].includes(role)) {
            return new Response(
                JSON.stringify({ error: 'Invalid role. Must be "patient" or "doctor".' }),
                { status: 400 }
            );
        }

        // Check if the user already exists by email
        const existingUser = await DUser.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ error: 'User already exists with this email.' }),
                { status: 400 }
            );
        }

        // Create new user
        const newUser = new DUser({
            userId,
            name,
            username,
            email,
            phone: phone || '',
            wallet: wallet || 0,
            isAdmin: isAdmin || false,
            role: role || 'patient',
            password: "cant retrieve password from kindeAuth"
        });

        await newUser.save();

        return new Response(
            JSON.stringify({ message: 'User created successfully', user: newUser }),
            { status: 201 }
        );
    } catch (error) {
        console.error('POST Error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}


export async function PUT(req) {
    try {
        await connectDB(); // Ensure MongoDB connection

        const { email, wallet } = await req.json();

        // Validate email and wallet
        if (!email || wallet === undefined) {
            return new Response(
                JSON.stringify({ error: 'Email and wallet are required' }),
                { status: 400 }
            );
        }

        // Check if the user exists by email
        const existingUser = await DUser.findOne({ email });
        if (!existingUser) {
            return new Response(
                JSON.stringify({ error: 'User does not exist with this email' }),
                { status: 404 }
            );
        }

        // Update the wallet
        let amount=existingUser.wallet;
        existingUser.wallet = wallet+amount;

        // Save the updated user
        await existingUser.save();

        // Return the updated user data
        return new Response(
            JSON.stringify({
                message: 'User wallet updated successfully',
                user: {
                    userId: existingUser.userId,
                    name: existingUser.name,
                    username: existingUser.username,
                    email: existingUser.email,
                    phone: existingUser.phone,
                    wallet: existingUser.wallet,
                    isAdmin: existingUser.isAdmin,
                    role: existingUser.role,
                },
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('PUT Error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}
