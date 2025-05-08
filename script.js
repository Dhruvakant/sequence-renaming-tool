async function renameFiles() {
    const fileInput = document.getElementById('fileInput');
    const baseName = document.getElementById('baseName').value;
    const startNumber = parseInt(document.getElementById('startNumber').value, 10);
    const extension = document.getElementById('extension').value;
    const digitCount = parseInt(document.getElementById('digitCount').value, 10);
    const renameButton = document.getElementById('renameButton');
    const downloadButton = document.getElementById('downloadButton');
    const originalList = document.getElementById('originalList');
    const renamedList = document.getElementById('renamedList');
    const loader = document.getElementById('loader');
    const statusMessage = document.getElementById('statusMessage');

    renameButton.classList.remove('error');
    loader.style.display = 'block';
    statusMessage.style.display = 'none';

    if (!fileInput.files.length || !baseName.trim()) {
        renameButton.classList.add('error');
        loader.style.display = 'none';
        return;
    }

    originalList.innerHTML = '';
    renamedList.innerHTML = '';

    const files = Array.from(fileInput.files);
    const zip = new JSZip();
    let counter = startNumber;

    for (const file of files) {
        const formattedCounter = String(counter).padStart(digitCount, '0');  // Adjust number of digits
        let newName;
        if (baseName.endsWith('_n_')) {
            newName = baseName.replace('_n_', `_${formattedCounter}`);
        } else if (baseName.includes('_n_')) {
            newName = baseName.replace('_n_', `_${formattedCounter}_`);
        } else {
            newName = `${baseName}_${formattedCounter}`;
        }
        newName += '.' + extension;
        zip.file(newName, file);

        const originalEntry = document.createElement('p');
        originalEntry.textContent = file.name;
        originalList.appendChild(originalEntry);

        const renamedEntry = document.createElement('p');
        renamedEntry.textContent = newName;
        renamedList.appendChild(renamedEntry);

        counter++;
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);

    downloadButton.disabled = false;
    downloadButton.onclick = () => {
        const a = document.createElement('a');
        a.href = zipUrl;
        a.download = 'Renamed_files.zip';
        a.click();
    };

    loader.style.display = 'none';
    statusMessage.style.display = 'block';
    statusMessage.textContent = 'Renaming completed. You can now download the ZIP.';
}
