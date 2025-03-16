document.addEventListener('DOMContentLoaded', function() {
    // Get all modal elements and buttons
    const inwardBtn = document.getElementById('inwardBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const scrapBtn = document.getElementById('scrapBtn');
    const inwardModal = document.getElementById('inwardModal');
    const withdrawModal = document.getElementById('withdrawModal');
    const scrapModal = document.getElementById('scrapModal');
    const inwardForm = document.getElementById('inwardForm');
    const submitBtn = document.getElementById('submitBtn');
    const withdrawForm = document.getElementById('withdrawForm');
    const withdrawSubmitBtn = document.getElementById('withdrawSubmitBtn');

    // Debug log to verify script is running
    console.log('Script initialized, scrap button:', scrapBtn); // Debug log

    // Event listener for inward button
    inwardBtn.addEventListener('click', function() {
        inwardModal.classList.add('show');
    });

    // Event listener for withdraw button
    withdrawBtn.addEventListener('click', function() {
        console.log('Withdraw button clicked'); // Debug log
        withdrawModal.classList.add('show');
        console.log('Withdraw modal opened'); // Debug log
    });

    // Event listener for scrap button
    if (scrapBtn) {
        scrapBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Scrap button clicked'); // Debug log
            scrapModal.classList.add('show');
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === inwardModal) {
            closeModal();
        }
        if (e.target === withdrawModal) {
            closeWithdrawModal();
        }
        if (e.target === scrapModal) {
            closeScrapModal();
        }
    });

    // Handle form submission
    inwardForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Start loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const partNumber = document.getElementById('partNumber').value;
            const materialDesc = document.getElementById('materialDesc').value;
            const quantity = parseInt(document.getElementById('quantity').value);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Add to table
            addToTable(partNumber, materialDesc, quantity);

            // Show success state
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            submitBtn.innerHTML = '<i class="fas fa-check"></i><span>Added!</span>';

            // Close modal
            closeModal();
            inwardForm.reset();

        } catch (error) {
            console.error('Error:', error);
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Error</span>';
        } finally {
            submitBtn.disabled = false;
            // Reset button state
            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.innerHTML = '<i class="fas fa-plus"></i><span>Add Stock</span>';
            }, 2000);
        }
    });

    // Handle withdraw form submission
    withdrawForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted'); // Debug log
        
        withdrawSubmitBtn.classList.add('loading');
        withdrawSubmitBtn.disabled = true;

        try {
            const partNumber = document.getElementById('withdrawPartNumber').value;
            const quantity = parseInt(document.getElementById('withdrawQuantity').value);

            // Validate if part exists and has enough quantity
            const row = findStockRow(partNumber);
            if (!row) {
                throw new Error('Part number not found');
            }

            const currentQuantity = parseInt(row.cells[3].textContent);
            if (currentQuantity < quantity) {
                throw new Error('Insufficient stock');
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update table
            updateStockOut(row, quantity);

            // Show success state
            withdrawSubmitBtn.classList.remove('loading');
            withdrawSubmitBtn.classList.add('success');
            withdrawSubmitBtn.innerHTML = '<i class="fas fa-check"></i><span>Withdrawn!</span>';

            // Close modal and reset form
            setTimeout(() => {
                closeWithdrawModal();
                withdrawForm.reset();
            }, 1500);

        } catch (error) {
            console.error('Error:', error);
            withdrawSubmitBtn.classList.remove('loading');
            withdrawSubmitBtn.classList.add('error');
            withdrawSubmitBtn.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${error.message}</span>`;
        } finally {
            setTimeout(() => {
                withdrawSubmitBtn.disabled = false;
                withdrawSubmitBtn.classList.remove('success', 'error');
                withdrawSubmitBtn.innerHTML = '<i class="fas fa-minus"></i><span>Withdraw Stock</span>';
            }, 2000);
        }
    });

    // Handle scrap form submission
    const scrapForm = document.getElementById('scrapForm');
    if (scrapForm) {
        scrapForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const scrapSubmitBtn = document.getElementById('scrapSubmitBtn');
            
            try {
                // Start loading state
                scrapSubmitBtn.classList.add('loading');
                scrapSubmitBtn.disabled = true;

                const partNumber = document.getElementById('scrapPartNumber').value;
                const quantity = parseInt(document.getElementById('scrapQuantity').value);
                const reason = document.getElementById('scrapReason').value;

                // Validate inputs
                if (!partNumber || !quantity || !reason) {
                    throw new Error('All fields are required');
                }

                // Validate if part exists and has enough quantity
                const row = findStockRow(partNumber);
                if (!row) {
                    throw new Error('Part number not found');
                }

                const currentQuantity = parseInt(row.cells[3].textContent);
                if (currentQuantity < quantity) {
                    throw new Error('Insufficient stock');
                }

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Update table
                updateScrapStock(row, quantity, reason);

                // Show success state
                scrapSubmitBtn.classList.remove('loading');
                scrapSubmitBtn.classList.add('success');
                scrapSubmitBtn.innerHTML = '<i class="fas fa-check"></i><span>Scrapped!</span>';

                // Close modal after delay
                setTimeout(() => {
                    closeScrapModal();
                    scrapForm.reset();
                }, 1500);

            } catch (error) {
                console.error('Error:', error);
                scrapSubmitBtn.classList.remove('loading');
                scrapSubmitBtn.classList.add('error');
                scrapSubmitBtn.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${error.message}</span>`;
            } finally {
                setTimeout(() => {
                    scrapSubmitBtn.disabled = false;
                    scrapSubmitBtn.classList.remove('success', 'error');
                    scrapSubmitBtn.innerHTML = '<i class="fas fa-trash-alt"></i><span>Scrap Stock</span>';
                }, 2000);
            }
        });
    }
});

// Close modal functions
function closeModal() {
    const modal = document.getElementById('inwardModal');
    modal.classList.remove('show');
    document.getElementById('inwardForm').reset();
}

function closeWithdrawModal() {
    const modal = document.getElementById('withdrawModal');
    modal.classList.remove('show');
    document.getElementById('withdrawForm').reset();
}

function closeScrapModal() {
    const modal = document.getElementById('scrapModal');
    const form = document.getElementById('scrapForm');
    if (modal) {
        modal.classList.remove('show');
    }
    if (form) {
        form.reset();
    }
}

function addToTable(partNumber, materialDesc, quantity) {
    const tbody = document.getElementById('stockTableBody');
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
        <td class="px-6 py-4 text-sm text-gray-900">${tbody.children.length + 1}</td>
        <td class="px-6 py-4 text-sm text-gray-900">${partNumber}</td>
        <td class="px-6 py-4 text-sm text-gray-600">${materialDesc}</td>
        <td class="px-6 py-4 text-sm text-gray-900">${quantity}</td>
        <td class="px-6 py-4 text-center text-sm text-emerald-600">${quantity}</td>
        <td class="px-6 py-4 text-center text-sm text-amber-600">0</td>
        <td class="px-6 py-4 text-center text-sm text-red-600">0</td>
        <td class="px-6 py-4 text-center">
            <button class="text-blue-600 hover:text-blue-800 mx-1">
                <i class="fas fa-edit"></i>
            </button>
            <button class="text-red-600 hover:text-red-800 mx-1">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(tr);
}

function findStockRow(partNumber) {
    const rows = document.getElementById('stockTableBody').getElementsByTagName('tr');
    for (let row of rows) {
        if (row.cells[1].textContent === partNumber) {
            return row;
        }
    }
    return null;
}

function updateStockOut(row, quantity) {
    const currentTotal = parseInt(row.cells[3].textContent);
    const currentStockOut = parseInt(row.cells[5].textContent);
    
    // Update current total
    row.cells[3].textContent = currentTotal - quantity;
    
    // Update stock out
    row.cells[5].innerHTML = `
        <span class="text-sm text-amber-600">${quantity}</span>
        <span class="text-xs text-gray-500">(${currentStockOut + quantity})</span>
    `;
}

function updateScrapStock(row, quantity, reason) {
    const currentTotal = parseInt(row.cells[3].textContent);
    const currentScrap = parseInt(row.cells[6].textContent);
    
    // Update current total
    row.cells[3].textContent = currentTotal - quantity;
    
    // Update scrap column
    row.cells[6].innerHTML = `
        <span class="text-sm text-red-600">${quantity}</span>
        <span class="text-xs text-gray-500" title="${reason}">(${currentScrap + quantity})</span>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const withdrawBtn = document.querySelector('#withdrawBtn');
    const withdrawModal = document.querySelector('#withdrawModal');
    
    console.log('Withdraw button:', withdrawBtn); // Debug log
    console.log('Withdraw modal:', withdrawModal); // Debug log

    // Add click event listener to withdraw button
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Withdraw button clicked'); // Debug log
            if (withdrawModal) {
                withdrawModal.classList.add('show');
                console.log('Added show class to modal'); // Debug log
            }
        });
    }

    // Close modal when clicking outside
    if (withdrawModal) {
        withdrawModal.addEventListener('click', function(e) {
            if (e.target === withdrawModal) {
                closeWithdrawModal();
            }
        });
    }

    // Handle withdraw form submission
    const withdrawForm = document.querySelector('#withdrawForm');
    if (withdrawForm) {
        withdrawForm.addEventListener('submit', handleWithdrawSubmit);
    }
});

async function handleWithdrawSubmit(e) {
    e.preventDefault();
    const withdrawSubmitBtn = document.querySelector('#withdrawSubmitBtn');
    
    try {
        withdrawSubmitBtn.classList.add('loading');
        withdrawSubmitBtn.disabled = true;

        const partNumber = document.querySelector('#withdrawPartNumber').value;
        const quantity = parseInt(document.querySelector('#withdrawQuantity').value);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success state
        withdrawSubmitBtn.classList.remove('loading');
        withdrawSubmitBtn.classList.add('success');
        withdrawSubmitBtn.innerHTML = '<i class="fas fa-check"></i><span>Withdrawn!</span>';

        // Close modal after delay
        setTimeout(closeWithdrawModal, 1500);

    } catch (error) {
        console.error('Error:', error);
        withdrawSubmitBtn.classList.remove('loading');
        withdrawSubmitBtn.classList.add('error');
        withdrawSubmitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Error</span>';
    }
}

function closeWithdrawModal() {
    const modal = document.querySelector('#withdrawModal');
    const form = document.querySelector('#withdrawForm');
    if (modal) {
        modal.classList.remove('show');
    }
    if (form) {
        form.reset();
    }
}