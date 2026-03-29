const sdk = require('node-appwrite');

module.exports = async function (context) {
    const client = new sdk.Client();
    const database = new sdk.Databases(client);
    const storage = new sdk.Storage(client);

    client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const now = new Date();
    // သတ်အခိင် ၇ တ္ၚဲ (7 days in milliseconds)
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();

    try {
        // ၁. ဇိုတ်လိက် Chat မနွံအယုက် ၇ တ္ၚဲ
        const messages = await database.listDocuments(
            'YOUR_DATABASE_ID', 
            'YOUR_COLLECTION_ID', 
            [sdk.Query.lessThan('$createdAt', sevenDaysAgo)]
        );

        for (const doc of messages.documents) {
            await database.deleteDocument('YOUR_DATABASE_ID', 'YOUR_COLLECTION_ID', doc.$id);
        }

        // ၂. ဇိုတ် File (Audio/Photo) မနွံအယုက် ၇ တ္ၚဲ
        const files = await storage.listFiles('69c9273f001aa6619d02'); // Bucket ID မၞး
        
        for (const file of files.files) {
            if (new Date(file.$createdAt) < new Date(sevenDaysAgo)) {
                await storage.deleteFile('69c9273f001aa6619d02', file.$id);
            }
        }

        context.log('Cleanup Success: ၇ တ္ၚဲမွဲဝါ ဇိုတ်အံင်ဇၞော်အာယျ!');
        return context.res.json({ status: 'success' });

    } catch (err) {
        context.error('Error: ' + err.message);
        return context.res.json({ status: 'error', error: err.message });
    }
};