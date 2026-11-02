let zeroKnowledge = null;

async function loadKnowledge() {
    try {
        const response = await fetch("data/knowledge.json");
        if (!response.ok) throw new Error("No se pudo cargar la matriz.");
        zeroKnowledge = await response.json();
        console.log(`Zero Knowledge v${zeroKnowledge.version} cargado.`);
    } catch (error) {
        console.error("Error cargando la matriz de conocimiento:", error);
    }
}

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[¿?¡!.,;:]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function randomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

function hasPhrase(query, phrase) {
    const q = ` ${query} `;
    const p = ` ${normalizeText(phrase)} `;
    return q.includes(p);
}

function calculateScore(query, item) {
    let score = 0;

    if (item.patterns) {
        item.patterns.forEach(pattern => {
            const p = normalizeText(pattern);
            if (query === p) score += 100;
            else if (query.includes(p)) score += 40;
        });
    }

    if (item.terms) {
        item.terms.forEach(term => {
            if (hasPhrase(query, term)) score += 5;
        });
    }

    // Reglas mínimas de desambiguación para esta prueba.
    if (item.id === "REP_REGIONAL") {
        if (hasPhrase(query, "regional") || hasPhrase(query, "region") || hasPhrase(query, "regiones")) score += 30;
        if (hasPhrase(query, "ayuda memoria") && !hasPhrase(query, "cite") && !hasPhrase(query, "ut")) score += 10;
    }

    if (item.id === "REP_CITE_UT") {
        if (hasPhrase(query, "cite") || hasPhrase(query, "ut") || hasPhrase(query, "unidad tecnica")) score += 30;
        if (hasPhrase(query, "regional") || hasPhrase(query, "region")) score -= 20;
    }

    if (item.id === "APP_001") {
        if (hasPhrase(query, "mapa") || hasPhrase(query, "ubicacion") || hasPhrase(query, "ubicaciones") || hasPhrase(query, "donde estan")) score += 30;
    }

    if (score > 0) score += item.priority || 0;
    return score;
}

function findKnowledge(userText) {
    if (!zeroKnowledge) {
        return {
            response: "Mi base de conocimiento todavía se está cargando.",
            action: null
        };
    }

    const query = normalizeText(userText);
    let bestMatch = null;
    let bestScore = 0;

    zeroKnowledge.knowledge.forEach(item => {
        const score = calculateScore(query, item);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    });

    if (!bestMatch || bestScore < 15) {
        return {
            response: randomResponse(zeroKnowledge.fallback.responses),
            action: null
        };
    }

    return {
        id: bestMatch.id,
        type: bestMatch.type,
        name: bestMatch.name,
        score: bestScore,
        response: randomResponse(bestMatch.responses),
        action: bestMatch.action || null
    };
}
