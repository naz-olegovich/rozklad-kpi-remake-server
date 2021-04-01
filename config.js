const url = "mongodb://localhost:27017/";
const dbName = "rozklad_kpi_remake";
const dbGroupsCollection = "groupsTimetable";
const dbTeachersCollection = "teachersLessons";
const port = 3000
const baseURL = `http://localhost:${port}`;

module.exports = {
    connection: {
        url: url,
        db: dbName,
        dbGroupsCollection: dbGroupsCollection,
        dbTeachersCollection: dbTeachersCollection
    },
    // The secret for the encryption of the jsonwebtoken
    JWTsecret: 'mysecret',
    baseURL: baseURL,
    port: port,
    // The credentials and information for OAuth2
    oauth2Credentials: {
        client_id: "674271237644-qvhjpok5r8o45cqn9tki3d28odqb8hg8.apps.googleusercontent.com",
        project_id: "rozklad-kpi-remake-test", // The name of your project
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_secret: "s7tL-qsCAMDlBnh82afrIKCu",
        redirect_uris: [
            `${baseURL}/auth_callback`
        ],
        scopes: [
            'https://www.googleapis.com/auth/youtube.readonly'
        ]
    },
}