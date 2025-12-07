class BinarySearchVisualizer {
    constructor() {
        this.array = [];
        this.target = null;
        this.left = 0;
        this.right = 0;
        this.middle = 0;
        this.steps = [];
        this.currentStep = 0;
        this.isAnimating = false;
        this.animationSpeed = 1000; // milliseconds
        
        this.initializeArray();
        this.setupEventListeners();
        this.renderArray();
    }
    
    initializeArray() {
        // Create a sorted array of numbers from 1 to 20
        this.array = Array.from({ length: 20 }, (_, i) => i + 1);
    }
    
    setupEventListeners() {
        const searchBtn = document.getElementById('searchBtn');
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const stepBtn = document.getElementById('stepBtn');
        const targetInput = document.getElementById('targetInput');
        
        searchBtn.addEventListener('click', () => this.startSearch());
        playBtn.addEventListener('click', () => this.playAnimation());
        pauseBtn.addEventListener('click', () => this.pauseAnimation());
        resetBtn.addEventListener('click', () => this.reset());
        stepBtn.addEventListener('click', () => this.stepForward());
        targetInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startSearch();
            }
        });
    }
    
    startSearch() {
        const targetInput = document.getElementById('targetInput');
        const target = parseInt(targetInput.value);
        
        if (isNaN(target) || target < 1 || target > 20) {
            this.showResult('Please enter a valid number between 1 and 20', 'error');
            return;
        }
        
        this.target = target;
        this.left = 0;
        this.right = this.array.length - 1;
        this.steps = [];
        this.currentStep = 0;
        
        this.generateSteps();
        this.resetArrayDisplay();
        this.updateInfo();
        this.showResult('Search started! Click "Step" or "Play" to begin.', 'info');
        
        // Enable animation controls
        document.getElementById('playBtn').disabled = false;
        document.getElementById('stepBtn').disabled = false;
    }
    
    generateSteps() {
        let left = 0;
        let right = this.array.length - 1;
        let step = 0;
        
        while (left <= right) {
            const middle = Math.floor((left + right) / 2);
            const middleValue = this.array[middle];
            
            this.steps.push({
                left: left,
                right: right,
                middle: middle,
                middleValue: middleValue,
                target: this.target,
                comparison: middleValue === this.target ? 'equal' : 
                           middleValue < this.target ? 'less' : 'greater',
                action: middleValue === this.target ? 'found' : 
                       middleValue < this.target ? 'search_right' : 'search_left'
            });
            
            if (middleValue === this.target) {
                break;
            } else if (middleValue < this.target) {
                left = middle + 1;
            } else {
                right = middle - 1;
            }
            
            step++;
        }
        
        // Add final step if target not found
        if (left > right) {
            this.steps.push({
                left: left,
                right: right,
                middle: -1,
                middleValue: -1,
                target: this.target,
                comparison: 'not_found',
                action: 'not_found'
            });
        }
    }
    
    playAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        document.getElementById('playBtn').disabled = true;
        document.getElementById('stepBtn').disabled = true;
        
        this.animateStep();
    }
    
    animateStep() {
        if (this.currentStep >= this.steps.length || !this.isAnimating) {
            this.isAnimating = false;
            document.getElementById('playBtn').disabled = false;
            document.getElementById('stepBtn').disabled = false;
            return;
        }
        
        this.executeStep(this.currentStep);
        this.currentStep++;
        
        setTimeout(() => {
            this.animateStep();
        }, this.animationSpeed);
    }
    
    pauseAnimation() {
        this.isAnimating = false;
        document.getElementById('playBtn').disabled = false;
        document.getElementById('stepBtn').disabled = false;
    }
    
    stepForward() {
        if (this.currentStep >= this.steps.length) {
            this.showResult('Animation complete!', 'info');
            return;
        }
        
        this.executeStep(this.currentStep);
        this.currentStep++;
        
        if (this.currentStep >= this.steps.length) {
            document.getElementById('stepBtn').disabled = true;
        }
    }
    
    executeStep(stepIndex) {
        const step = this.steps[stepIndex];
        
        // Update search boundaries
        this.left = step.left;
        this.right = step.right;
        this.middle = step.middle;
        
        // Update array display
        this.updateArrayDisplay(step);
        
        // Update info panel
        this.updateInfo();
        
        // Update step information
        this.updateStepInfo(step);
        
        // Check if search is complete
        if (step.action === 'found') {
            this.showResult(`Target ${step.target} found at index ${step.middle}!`, 'success');
            this.isAnimating = false;
            document.getElementById('playBtn').disabled = true;
            document.getElementById('stepBtn').disabled = true;
        } else if (step.action === 'not_found') {
            this.showResult(`Target ${step.target} not found in the array.`, 'error');
            this.isAnimating = false;
            document.getElementById('playBtn').disabled = true;
            document.getElementById('stepBtn').disabled = true;
        }
    }
    
    updateArrayDisplay(step) {
        const arrayContainer = document.getElementById('array');
        arrayContainer.innerHTML = '';
        
        for (let i = 0; i < this.array.length; i++) {
            const element = document.createElement('div');
            element.className = 'array-element';
            element.textContent = this.array[i];
            element.id = `element-${i}`;
            
            // Highlight elements based on current step
            if (i === step.middle) {
                element.classList.add('active');
            } else if (i >= step.left && i <= step.right) {
                element.classList.add('range');
            }
            
            // Special highlighting for found/not found
            if (step.action === 'found' && i === step.middle) {
                element.classList.add('found');
            } else if (step.action === 'not_found' && i === step.middle) {
                element.classList.add('not-found');
            }
            
            arrayContainer.appendChild(element);
        }
    }
    
    updateInfo() {
        document.getElementById('leftIndex').textContent = this.left;
        document.getElementById('rightIndex').textContent = this.right;
        document.getElementById('middleIndex').textContent = this.middle;
        document.getElementById('targetValue').textContent = this.target;
    }
    
    updateStepInfo(step) {
        const stepInfo = document.getElementById('stepInfo');
        let infoText = '';
        
        if (step.action === 'found') {
            infoText = `Found target ${step.target} at index ${step.middle}!`;
        } else if (step.action === 'not_found') {
            infoText = `Target ${step.target} not found. Search complete.`;
        } else if (step.comparison === 'less') {
            infoText = `Middle value ${step.middleValue} < target ${step.target}. Searching right half.`;
        } else if (step.comparison === 'greater') {
            infoText = `Middle value ${step.middleValue} > target ${step.target}. Searching left half.`;
        }
        
        stepInfo.textContent = infoText;
    }
    
    showResult(message, type) {
        const resultText = document.getElementById('resultText');
        resultText.textContent = message;
        resultText.className = type;
    }
    
    resetArrayDisplay() {
        const arrayContainer = document.getElementById('array');
        arrayContainer.innerHTML = '';
        
        for (let i = 0; i < this.array.length; i++) {
            const element = document.createElement('div');
            element.className = 'array-element';
            element.textContent = this.array[i];
            element.id = `element-${i}`;
            arrayContainer.appendChild(element);
        }
    }
    
    renderArray() {
        this.resetArrayDisplay();
    }
    
    reset() {
        this.target = null;
        this.left = 0;
        this.right = 0;
        this.middle = 0;
        this.steps = [];
        this.currentStep = 0;
        this.isAnimating = false;
        
        this.resetArrayDisplay();
        this.updateInfo();
        this.showResult('Ready to search! Enter a target number and click "Search".', 'info');
        
        // Reset controls
        document.getElementById('playBtn').disabled = true;
        document.getElementById('stepBtn').disabled = true;
        document.getElementById('targetInput').value = '';
        
        // Reset step info
        document.getElementById('stepInfo').textContent = 'Click "Search" to start';
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BinarySearchVisualizer();
});
