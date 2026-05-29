class HanoiGame {
    constructor() {
        this.gameState = {
            disksCount: 5,
            pegs: [[], [], []],
            moves: 0,
            isAutoSolving: false,
            selectedPegIndex: null
        };

        this.initElements();
        this.bindEvents();
        this.resetGame();
    }

    initElements() {
        this.diskCountInput = document.getElementById('diskCount');
        this.moveCountEl = document.getElementById('moveCount');
        this.resetBtn = document.getElementById('resetBtn');
        this.autoSolveBtn = document.getElementById('autoSolveBtn');
        this.warningEl = document.getElementById('warning');
        this.victoryModal = document.getElementById('victoryModal');
        this.finalMovesEl = document.getElementById('finalMoves');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.pegsEls = document.querySelectorAll('.peg');
    }

    bindEvents() {
        this.diskCountInput.addEventListener('change', () => {
            const count = parseInt(this.diskCountInput.value);
            if (count >= 3 && count <= 8) {
                this.gameState.disksCount = count;
                this.resetGame();
            } else {
                this.diskCountInput.value = this.gameState.disksCount;
            }
        });

        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.autoSolveBtn.addEventListener('click', () => this.autoSolve());
        this.playAgainBtn.addEventListener('click', () => {
            this.victoryModal.classList.add('hidden');
            this.resetGame();
        });

        this.pegsEls.forEach((pegEl, index) => {
            pegEl.addEventListener('click', () => this.handlePegClick(index));
        });
    }

    resetGame() {
        this.gameState.moves = 0;
        this.gameState.isAutoSolving = false;
        this.gameState.selectedPegIndex = null;
        this.gameState.pegs = [[], [], []];

        // 初始化圆盘到A柱
        for (let i = this.gameState.disksCount; i >= 1; i--) {
            this.gameState.pegs[0].push(i);
        }

        this.updateMoveCount();
        this.render();
        this.hideWarning();
        this.enableControls();
    }

    render() {
        // 清空所有柱子
        this.pegsEls.forEach(pegEl => pegEl.innerHTML = '');

        // 渲染圆盘
        this.gameState.pegs.forEach((stack, pegIndex) => {
            stack.forEach(diskSize => {
                const diskEl = document.createElement('div');
                diskEl.className = `disk disk-${diskSize}`;
                diskEl.dataset.size = diskSize;
                diskEl.dataset.peg = pegIndex;
                this.pegsEls[pegIndex].appendChild(diskEl);
            });
        });
    }

    handlePegClick(pegIndex) {
        if (this.gameState.isAutoSolving) return;

        if (this.gameState.selectedPegIndex === null) {
            // 选中柱子顶部的圆盘
            if (this.gameState.pegs[pegIndex].length > 0) {
                this.gameState.selectedPegIndex = pegIndex;
                this.pegsEls[pegIndex].lastChild.style.transform = 'translateY(-10px)';
            }
        } else {
            // 尝试移动圆盘
            const fromIndex = this.gameState.selectedPegIndex;
            const toIndex = pegIndex;

            if (fromIndex !== toIndex) {
                if (this.isValidMove(fromIndex, toIndex)) {
                    this.executeMove(fromIndex, toIndex);
                } else {
                    this.showWarning();
                }
            }

            // 取消选中
            if (this.gameState.pegs[fromIndex].length > 0) {
                this.pegsEls[fromIndex].lastChild.style.transform = '';
            }
            this.gameState.selectedPegIndex = null;
        }
    }

    isValidMove(fromIndex, toIndex) {
        const fromStack = this.gameState.pegs[fromIndex];
        const toStack = this.gameState.pegs[toIndex];

        if (fromStack.length === 0) return false;

        const movingDisk = fromStack[fromStack.length - 1];
        const topDisk = toStack.length > 0 ? toStack[toStack.length - 1] : null;

        return topDisk === null || movingDisk < topDisk;
    }

    executeMove(fromIndex, toIndex) {
        const disk = this.gameState.pegs[fromIndex].pop();
        this.gameState.pegs[toIndex].push(disk);
        this.gameState.moves++;
        this.updateMoveCount();
        this.render();

        if (this.checkWin()) {
            setTimeout(() => this.showVictory(), 300);
        }
    }

    checkWin() {
        return this.gameState.pegs[2].length === this.gameState.disksCount;
    }

    showWarning() {
        this.warningEl.classList.remove('hidden');
        this.warningEl.classList.add('show');
        setTimeout(() => this.hideWarning(), 1000);
    }

    hideWarning() {
        this.warningEl.classList.add('hidden');
        this.warningEl.classList.remove('show');
    }

    showVictory() {
        this.finalMovesEl.textContent = this.gameState.moves;
   
