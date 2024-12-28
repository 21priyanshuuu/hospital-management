// import { connectDB } from '../../../lib/mongodb';
// import DUser from '../../../models/UserModel';

// export async function POST(req) {
//     try {
//         // Establish MongoDB connection
//         await connectDB();

//         // Parse the request body using await req.json()
//         const { username, email, password, img, isAdmin, phone, address, wallet, role } = await req.json();

//         // Validate role
//         if (!['patient', 'doctor'].includes(role)) {
//             return new Response(
//                 JSON.stringify({ error: 'Invalid role. Must be "patient" or "doctor".' }),
//                 { status: 400 }
//             );
//         }

//         // Check if the user already exists by email
//         const existingUser = await DUser.findOne({ email });
//         if (existingUser) {
//             return new Response(
//                 JSON.stringify({ error: 'User already exists with this email.' }),
//                 { status: 400 }
//             );
//         }

//         const newUser = new DUser({
//             username,
//             email,
//             password,    
//             img,
//             isAdmin: isAdmin || false,  
//             phone,
//             address,
//             wallet: wallet || 0,
//             role,
//         });

//         // Save the new user to the database
//         await newUser.save();

//         // Return success message with the new user object
//         return new Response(
//             JSON.stringify({ message: 'User created successfully', user: newUser }),
//             { status: 201 }
//         );
//     } catch (error) {
//         // Handle any errors that occur
//         return new Response(
//             JSON.stringify({ error: error.message }),
//             { status: 500 }
//         );
//     }
// }





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

