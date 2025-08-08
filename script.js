document.addEventListener('DOMContentLoaded', function() {
    // Atualiza o ano no footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Modelos e suas capacidades disponíveis
    const modelCapacities = {
        'iphone-xr': ['64', '128'],
        'iphone-11': ['64', '128', '256'],
        'iphone-11-pro': ['64', '256', '512'],
        'iphone-11-pro-max': ['64', '256', '512'],
        'iphone-12': ['64', '128', '256'],
        'iphone-12-pro': ['128', '256', '512'],
        'iphone-12-pro-max': ['128', '256', '512'],
        'iphone-13': ['128', '256', '512'],
        'iphone-13-pro': ['128', '256', '512', '1TB'],
        'iphone-13-pro-max': ['128', '256', '512', '1TB'],
        'iphone-14': ['128', '256', '512'],
        'iphone-14-pro': ['128', '256', '512', '1TB'],
        'iphone-14-pro-max': ['128', '256', '512', '1TB'],
        'iphone-15': ['128', '256', '512'],
        'iphone-15-pro': ['128', '256', '512', '1TB'],
        'iphone-15-pro-max': ['128', '256', '512', '1TB'],
        'iphone-16': ['128', '256', '512'],
        'iphone-16-pro': ['256', '512', '1TB'],
        'iphone-16-pro-max': ['256', '512', '1TB']
    };
    
    // Preços base por modelo e capacidade (valores exemplos)
    const modelPrices = {
        'iphone-xr': { '64': 2500, '128': 2800 },
        'iphone-11': { '64': 3000, '128': 3300, '256': 3600 },
        'iphone-11-pro': { '64': 3500, '256': 4000, '512': 4500 },
        'iphone-11-pro-max': { '64': 4000, '256': 4500, '512': 5000 },
        'iphone-12': { '64': 3500, '128': 3800, '256': 4200 },
        'iphone-12-pro': { '128': 4500, '256': 5000, '512': 5500 },
        'iphone-12-pro-max': { '128': 5000, '256': 5500, '512': 6000 },
        'iphone-13': { '128': 4000, '256': 4500, '512': 5000 },
        'iphone-13-pro': { '128': 5000, '256': 5500, '512': 6000, '1TB': 6500 },
        'iphone-13-pro-max': { '128': 5500, '256': 6000, '512': 6500, '1TB': 7000 },
        'iphone-14': { '128': 4500, '256': 5000, '512': 5500 },
        'iphone-14-pro': { '128': 6000, '256': 6500, '512': 7000, '1TB': 7500 },
        'iphone-14-pro-max': { '128': 6500, '256': 7000, '512': 7500, '1TB': 8000 },
        'iphone-15': { '128': 5000, '256': 5500, '512': 6000 },
        'iphone-15-pro': { '128': 7000, '256': 7500, '512': 8000, '1TB': 8500 },
        'iphone-15-pro-max': { '128': 7500, '256': 8000, '512': 8500, '1TB': 9000 },
        'iphone-16': { '128': 5500, '256': 6000, '512': 6500 },
        'iphone-16-pro': { '256': 8000, '512': 8500, '1TB': 9000 },
        'iphone-16-pro-max': { '256': 8500, '512': 9000, '1TB': 9500 }
    };
    
    // Taxas de parcelamento
    const installmentRates = {
        1: 0,
        2: 0.02,
        3: 0.03,
        4: 0.04,
        5: 0.05,
        6: 0.06,
        7: 0.07,
        8: 0.08,
        9: 0.09,
        10: 0.10,
        11: 0.11,
        12: 0.12,
        13: 0.13,
        14: 0.14,
        15: 0.15,
        16: 0.16,
        17: 0.17,
        18: 0.18
    };
    
    // Atualiza as opções de capacidade quando o modelo é selecionado
    document.getElementById('model').addEventListener('change', function() {
        const selectedModel = this.value;
        const storageSelect = document.getElementById('storage');
        
        // Limpa as opções atuais
        storageSelect.innerHTML = '<option value="" disabled selected>Selecione a capacidade</option>';
        
        if (selectedModel && modelCapacities[selectedModel]) {
            // Adiciona as opções de capacidade disponíveis para o modelo selecionado
            modelCapacities[selectedModel].forEach(capacity => {
                const option = document.createElement('option');
                option.value = capacity;
                option.textContent = `${capacity}GB`;
                storageSelect.appendChild(option);
            });
            
            // Preenche automaticamente o preço se houver apenas uma opção de capacidade
            if (modelCapacities[selectedModel].length === 1) {
                const capacity = modelCapacities[selectedModel][0];
                document.getElementById('price').value = modelPrices[selectedModel][capacity];
            }
        }
    });
    
    // Atualiza o preço quando a capacidade é selecionada
    document.getElementById('storage').addEventListener('change', function() {
        const selectedModel = document.getElementById('model').value;
        const selectedCapacity = this.value;
        
        if (selectedModel && selectedCapacity && modelPrices[selectedModel] && modelPrices[selectedModel][selectedCapacity]) {
            document.getElementById('price').value = modelPrices[selectedModel][selectedCapacity];
        }
    });
    
    // Calcula as parcelas quando clicar no botão
    document.getElementById('calculate').addEventListener('click', function() {
        const price = parseFloat(document.getElementById('price').value);
        const model = document.getElementById('model').value;
        const storage = document.getElementById('storage').value;
        
        if (!model) {
            alert('Por favor, selecione um modelo de iPhone.');
            return;
        }
        
        if (!storage) {
            alert('Por favor, selecione a capacidade de armazenamento.');
            return;
        }
        
        if (isNaN(price) || price <= 0) {
            alert('Por favor, insira um valor válido para o iPhone.');
            return;
        }
        
        calculateInstallments(price);
    });
    
    function calculateInstallments(basePrice) {
        const installmentsGrid = document.getElementById('installments-grid');
        installmentsGrid.innerHTML = '';
        
        let totalPrice = basePrice;
        let highlightIndex = 6; // Destaca a parcela de 6x
        
        // Calcula cada parcela de 1 até 18x
        for (let i = 1; i <= 18; i++) {
            const rate = installmentRates[i];
            const totalWithRate = basePrice * (1 + rate);
            const installmentValue = totalWithRate / i;
            
            totalPrice = totalWithRate; // Atualiza para mostrar o total da última parcela
            
            const installmentCard = document.createElement('div');
            installmentCard.className = `installment-card ${i === highlightIndex ? 'highlight' : ''}`;
            installmentCard.innerHTML = `
                <div class="installment-times">${i}x</div>
                <div class="installment-value">R$ ${installmentValue.toFixed(2).replace('.', ',')}</div>
                <div class="installment-total">Total: R$ ${totalWithRate.toFixed(2).replace('.', ',')}</div>
            `;
            
            installmentsGrid.appendChild(installmentCard);
        }
        
        // Atualiza o preço total e mostra os resultados
        document.getElementById('total-price').textContent = totalPrice.toFixed(2).replace('.', ',');
        document.getElementById('results').classList.add('active');
    }
});