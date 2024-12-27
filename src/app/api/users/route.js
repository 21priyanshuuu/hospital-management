import { connectDB } from '../../../lib/mongodb';
import DUser from '../../../models/UserModel';

export async function POST(req) {
    try {
        // Establish MongoDB connection
        await connectDB();

        // Parse the request body using await req.json()
        const { username, email, password, img, isAdmin, phone, address, wallet, role } = await req.json();

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

        const newUser = new DUser({
            username,
            email,
            password,    
            img,
            isAdmin: isAdmin || false,  
            phone,
            address,
            wallet: wallet || 0,
            role,
        });

        // Save the new user to the database
        await newUser.save();

        // Return success message with the new user object
        return new Response(
            JSON.stringify({ message: 'User created successfully', user: newUser }),
            { status: 201 }
        );
    } catch (error) {
        // Handle any errors that occur
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}
