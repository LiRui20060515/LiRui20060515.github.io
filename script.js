class HanoiGame {
    constructor() {
        this.disksCount = 5;
        this.pegs = [[], [], []];
        this.moves = 0;
        this.isAuto = false;
        this.selected = null;

        this.initDom();
        this.bindEvent();
        this.reset();
    }

    initDom() {
        this.diskInput = document.getElementById('diskCount');
        this.moveText = document.getElementById('moveCount');
        this.resetBtn = document.getElementById('resetBtn');
        this.autoBtn = document.getElementById('autoSolveBtn');
        this.warn = document.getElementById('warning');
        this.modal = document.getElementById('victoryModal');
        this.finalMove = document.getElementById('finalMoves');
        this.againBtn = document.getElementById('playAgainBtn');
        this.pegList = document.querySelectorAll('.peg');
    }

    bindEvent() {
        this.diskInput.addEventListener('change', () => {
            let val = parseInt(this.diskInput.value);
            if(val >=3 && val <=8){
                this.disksCount = val;
                this.reset();
            }
        });

        this.resetBtn.addEventListener('click', () => this.reset());
        this.autoBtn.addEventListener('click', () => this.autoRun());
        this.againBtn.addEventListener('click', () => {
            this.modal.classList.add('hidden');
            this.reset();
        });

        this.pegList.forEach((peg, idx)=>{
            peg.addEventListener('click', ()=> this.clickPeg(idx));
        });
    }

    reset() {
        this.moves = 0;
        this.isAuto = false;
        this.selected = null;
        this.pegs = [[], [], []];

        for(let i = this.disksCount; i >= 1; i--){
            this.pegs[0].push(i);
        }

        this.updateMove();
        this.render();
        this.warn.classList.add('hidden');
        this.setBtn(true);
    }

    render() {
        this.pegList.forEach(peg => peg.innerHTML = "");
        this.pegs.forEach((stack, idx)=>{
            stack.forEach(size=>{
                let d = document.createElement('div');
                d.className = `disk disk-${size}`;
                this.pegList[idx].appendChild(d);
            });
        });
    }

    clickPeg(idx) {
        if(this.isAuto) return;
        if(this.selected === null){
            if(this.pegs[idx].length > 0){
                this.selected = idx;
            }
        }else{
            let from = this.selected;
            let to = idx;
            if(from !== to){
                if(this.check(from, to)){
                    this.moveDisk(from, to);
                }else{
                    this.warn.classList.remove('hidden');
                    setTimeout(()=> this.warn.classList.add('hidden'), 1000);
                }
            }
            this.selected = null;
        }
    }

    check(from, to) {
        let f = this.pegs[from];
        let t = this.pegs[to];
        if(f.length === 0) return false;
        let topF = f[f.length - 1];
        let topT = t.length ? t[t.length - 1] : null;
        return topT === null || topF < topT;
    }

    moveDisk(from, to) {
        let disk = this.pegs[from].pop();
        this.pegs[to].push(disk);
        this.moves++;
        this.updateMove();
        this.render();

        if(this.pegs[2].length === this.disksCount){
            setTimeout(()=>{
                this.finalMove.innerText = this.moves;
                this.modal.classList.remove('hidden');
            },300);
        }
    }

    updateMove() {
        this.moveText.innerText = this.moves;
    }

    setBtn(flag) {
        this.resetBtn.disabled = !flag;
        this.autoBtn.disabled = !flag;
        this.diskInput.disabled = !flag;
    }

    async autoRun() {
        if(this.isAuto) return;
        this.isAuto = true;
        this.setBtn(false);
        await this.solve(this.disksCount, 0, 2, 1);
        this.isAuto = false;
        this.setBtn(true);
    }

    async solve(n, s, t, a) {
        if(n === 0) return;
        await this.solve(n-1, s, a, t);
        await this.sleep(500);
        this.moveDisk(s, t);
        await this.solve(n-1, a, t, s);
    }

    sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
}

// 启动游戏（关键代码，已补齐）
document.addEventListener('DOMContentLoaded', function(){
    new HanoiGame();
});
