const autocannon = require('autocannon');
const logger = require('../utils/logger');

// Configuration des tests
const tests = [
    {
        title: 'Test de charge - GET /api/listings',
        url: 'http://localhost:5000/api/listings',
        method: 'GET',
        connections: 100,
        duration: 30
    },
    {
        title: 'Test de charge - GET /api/listings avec filtres',
        url: 'http://localhost:5000/api/listings?category=livres&city=tunis',
        method: 'GET',
        connections: 50,
        duration: 30
    },
    {
        title: 'Test de charge - POST /api/auth/login',
        url: 'http://localhost:5000/api/auth/login',
        method: 'POST',
        body: JSON.stringify({
            email: 'test@test.com',
            password: 'password123'
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        connections: 20,
        duration: 30
    }
];

// Fonction pour exécuter un test
const runLoadTest = async (test) => {
    logger.info(`Démarrage du test: ${test.title}`);

    const result = await autocannon({
        ...test,
        timeout: 20,
    });

    logger.info(`Résultats pour ${test.title}:`);
    logger.info(`Latence moyenne: ${result.latency.average} ms`);
    logger.info(`Requêtes/sec: ${result.requests.average}`);
    logger.info(`Transfert/sec: ${result.throughput.average} bytes`);
    logger.info(`Erreurs: ${result.errors}`);

    return result;
};

// Exécution de tous les tests
const runAllTests = async () => {
    for (const test of tests) {
        try {
            await runLoadTest(test);
        } catch (error) {
            logger.error(`Erreur lors du test ${test.title}:`, error);
        }
    }
};

// Lance les tests si exécuté directement
if (require.main === module) {
    runAllTests().then(() => {
        logger.info('Tests de charge terminés');
        process.exit(0);
    }).catch(error => {
        logger.error('Erreur lors des tests:', error);
        process.exit(1);
    });
}

module.exports = { runLoadTest, runAllTests };