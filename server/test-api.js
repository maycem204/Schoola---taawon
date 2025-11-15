const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testRegister() {
    console.log('\n🧪 Test d\'inscription...');
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username: 'testuser' + Date.now(),
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            city: 'Tunis'
        });
        console.log('✅ Inscription réussie:', response.data.user.username);
        return response.data.token;
    } catch (error) {
        console.error('❌ Erreur inscription:', error.response?.data || error.message);
        return null;
    }
}

async function testCreateListing(token) {
    console.log('\n🧪 Test de création d\'annonce...');
    try {
        const FormData = require('form-data');
        const formData = new FormData();
        
        formData.append('title', 'Manuel de mathématiques');
        formData.append('description', 'Manuel de mathématiques en excellent état, niveau lycée');
        formData.append('category', 'textbooks');
        formData.append('condition', 'like_new');
        formData.append('educationLevel', 'high');
        formData.append('city', 'Tunis');
        formData.append('exchangeType', 'sale');
        formData.append('price', '25');
        
        const response = await axios.post(`${API_URL}/listings`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Annonce créée:', response.data.title);
        return true;
    } catch (error) {
        console.error('❌ Erreur création annonce:', error.response?.data || error.message);
        return false;
    }
}

async function runTests() {
    console.log('🚀 Démarrage des tests API...\n');
    
    const token = await testRegister();
    if (!token) {
        console.log('\n❌ Tests arrêtés: échec de l\'inscription');
        return;
    }
    
    await testCreateListing(token);
    
    console.log('\n✅ Tests terminés!');
}

runTests();
