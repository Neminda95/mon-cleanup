const sdk = require('node-appwrite');

const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

async function cleanup() {
    try {
        const response = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID
        );
        console.log('Cleanup logic running for documents:', response.total);
        // Add more logic here to delete specific old documents
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

cleanup();
