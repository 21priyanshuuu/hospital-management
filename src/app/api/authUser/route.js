import { connectDB } from '../../../lib/mongodb';
import AuthUser from '../../../models/AuthUser';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

// GET: Fetch user details, create if not exists
export async function GET() {
    try {
        const { isAuthenticated, getUser } = getKindeServerSession();

        if (!await isAuthenticated()) {
            return Response.json({ error: 'User not authenticated' }, { status: 401 });
        }

        const user = await getUser();

        await connectDB();

        // Check if the email exists in AuthUser
        let existingUser = await AuthUser.findOne({ email: user.email });

        if (!existingUser) {
            // If not found, create a new user entry
            await AuthUser.create({
                userId: user.id || '', // Fallback to empty string if id is not available
                name: (user.given_name+' '+user.family_name) || 'Unknown',
                username: user.username || 'unknown_user',
                email: user.email,
            });
        }

        return Response.json({ email: user.email }, { status: 200 });
    } catch (error) {
        console.error('Error in GET:', error);
        return Response.json({ error: 'Failed to fetch or create user details' }, { status: 500 });
    }
}

// POST: Save or update user in the database
export async function POST(req) {
    try {
        await connectDB();

        const { userId, name, username, email } = await req.json();

        if (!userId || !name || !username || !email) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        let existingUser = await AuthUser.findOne({ userId });

        if (existingUser) {
            // Update existing user
            existingUser.name = name;
            existingUser.username = username;
            existingUser.email = email;
            await existingUser.save();
        } else {
            // Create new user
            await AuthUser.create({
                userId,
                name,
                username,
                email,
            });
        }

        return Response.json({ message: 'User saved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error saving user details:', error);
        return Response.json({ error: 'Failed to save user details' }, { status: 500 });
    }
}
