// src/routes/create-trip/+page.server.ts
import { redirect, error, type RequestEvent } from '@sveltejs/kit';
import sql from '$lib/server/database.js';
import { adminAuth } from '$lib/server/firebase-admin';

export const actions = {
    default: async ({ request }: RequestEvent) => {
        try {
            console.log('Processing create trip request...');
            let tripName: string;
            let startDate: string;
            let endDate: string;
            let members: string[] = [];
            let idToken: string | undefined;
            let tripLocation: string;
            let tripTotalDays: number;
            let tripImageUrl: string; 
 
 
            // Check content type to determine how to parse the request
            const contentType = request.headers.get('content-type') || '';
            console.log('Content type:', contentType);
 
 
            if (contentType.includes('application/json')) {
                //handle JSON request
                const body = await request.json();
                console.log('JSON body received:', JSON.stringify(body).substring(0, 200));
 
 
                idToken = body.firebaseToken;
                tripName = body.tripName;
                startDate = body.tripStartDate;
                endDate = body.tripEndDate;
                tripLocation = body.tripLocation;
                tripTotalDays = body.tripTotalDays;
                tripImageUrl = body.tripImageUrl || 'https://source.unsplash.com/400x300/?travel'; 
                // Ensure fallback image if tripImageUrl is blank
                
                                members = Array.isArray(body.members) ? body.members : [];
            } else {
                //handle form data request
                const formData = await request.formData();
                console.log('Form data received:', formData);
 
 
                idToken = formData.get('firebaseToken')?.toString();
                tripName = formData.get('tripName')?.toString() ?? '';
                if (!tripName) {
                    throw error(400, 'Trip name is required');
                }
                startDate = formData.get('tripStartDate')?.toString() ?? '';
                if (!startDate) {
                    throw error(400, 'Start date is required');
                }
                endDate = formData.get('tripEndDate')?.toString() ?? '';
                if(!endDate) {
                    throw error(400, 'End date is required');
                }
                members = formData.getAll('members').map((member) => member.toString());
                tripLocation = formData.get('tripLocation')?.toString() ?? '';
                tripTotalDays = Number((formData.get('tripTotalDays')?.toString() ?? '0'));
                tripImageUrl = formData.get('tripImageUrl')?.toString() ?? ''; 
            }
 
 
            // check auth header as backup
            if (!idToken) {
                const authHeader = request.headers.get('Authorization');
                console.log('Checking Authorization header:', !!authHeader);
 
 
                if(authHeader && authHeader.startsWith('Bearer ')) {
                    idToken = authHeader.substring(7);
                    console.log('Extracted idToken from Authorization header:', idToken);
                }
            }
 
 
            console.log('ID Token present:', !!idToken);
 
 
            if(!idToken) {
                console.error('Missing Firebase token');
                throw error(401, 'Missing Firebase token');
            }
 
 
            // Verify Firebase token
            const decodedToken = await adminAuth.verifyIdToken(idToken).catch(err => {
                console.error('Token verification failed:', err);
                throw error(401, 'Invalid credentials');
            });
 
 
            const firebaseUID = decodedToken.uid;
            console.log('Firebase UID:', firebaseUID);
 
 
            // Validate form data
            if (!tripName || !startDate || !endDate) {
                console.error('Missing required fields');
                throw error(400, 'Missing required fields');
            }
 
 
            //validate date format
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            if (isNaN(startDateObj.getTime())) throw error(400, 'Invalid start date');
            if (isNaN(endDateObj.getTime())) throw error(400, 'Invalid end date');
 
 
            //Calculate total days between start and end dates (inclusive)
            tripTotalDays = Math.floor((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            console.log('Trip total days:', tripTotalDays);
 
 
            console.log('Creating trip in database:', {
                tripName,
                dates: `${startDate} to ${endDate}`,
                totalDays: tripTotalDays,
                location: tripLocation,
                tripImageUrl
            });
 
 
            //Database insert
            const [newTrip] = await sql`
                INSERT INTO trips (name, start_date, end_date, owner_uid, location, image_url, total_days)
                VALUES (${tripName}, ${startDateObj}, ${endDateObj}, ${firebaseUID}, ${tripLocation}, ${tripImageUrl}, ${tripTotalDays})
                RETURNING id
                `;
                console.log('Trip created with ID:', newTrip.id);
 
 
                //Handle invites if present
                if (members.length > 0) {
                    console.log('Processing invites for members:', members.length);
                    //process member invites here
                }
 
 
                // If this is an API request, return JSON
                if (contentType.includes('application/json')) {
                    return {
                        status: 200,
                        body: {
                            success: true,
                            id: newTrip.id,
                            message: 'Trip created successfully'
                    }
                };
            }
 
 
            //otherwise redirect
            throw redirect(303, `/tripspage/${newTrip.id}`);
        } catch (err) {
            console.error('trip creation error:', err);
 
 
             // Check if it's an already formatted error
             if (err && typeof err === 'object' && 'status' in err) {
                throw err;
            }
           
            throw error(500, 'Failed to create trip - check server logs');
        }
    }
 }
 