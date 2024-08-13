let barcodeData = [];

// Configuração do QuaggaJS para leitura de código de barras
document.getElementById('start-scan').addEventListener('click', () => {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container'), // Container para a câmera
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment" // Usar a câmera traseira
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader", "2of5_reader", "code_93_reader"] // Tipos de códigos de barras a serem lidos
        }
    }, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });

    Quagga.onDetected((data) => {
        let code = data.codeResult.code;
        if (!barcodeData.includes(code)) {
            barcodeData.push(code);
            alert(`Barcode detected: ${code}`);
        }
        Quagga.stop();
    });
});

// Função para salvar os dados em uma planilha
document.getElementById('save-excel').addEventListener('click', () => {
    let ws = XLSX.utils.json_to_sheet(barcodeData.map(code => ({ barcode: code })));
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Barcodes");

    XLSX.writeFile(wb, "barcode_data.xlsx");
});
