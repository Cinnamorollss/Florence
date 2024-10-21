// gold.js

class GoldSystem {
    constructor(initialGold = 0) {
        this.gold = initialGold;
        this.incomeSources = {};
        this.expenses = [];
        this.transactions = [];
        this.loans = [];
        this.investments = [];
        this.taxRate = 0.1; // 10% tax rate
        this.inflation = 0.02; // 2% annual inflation
    }

    earnGold(amount, source) {
        if (amount > 0) {
            const taxedAmount = amount * (1 - this.taxRate);
            this.gold += taxedAmount;
            this.transactions.push({ type: 'earn', amount: taxedAmount, source, date: new Date() });
            return `Earned ${taxedAmount.toFixed(2)} gold (after tax) from ${source}. Total gold: ${this.gold.toFixed(2)}`;
        } else {
            return 'Invalid amount to earn.';
        }
    }

    spendGold(amount, reason) {
        if (amount > 0 && amount <= this.gold) {
            this.gold -= amount;
            this.expenses.push({ amount, reason, date: new Date() });
            this.transactions.push({ type: 'spend', amount, reason, date: new Date() });
            return `Spent ${amount.toFixed(2)} gold on ${reason}. Total gold: ${this.gold.toFixed(2)}`;
        } else {
            return 'Invalid amount to spend or insufficient gold.';
        }
    }

    addIncomeSource(sourceName, amount, frequency = 'daily') {
        this.incomeSources[sourceName] = { amount, frequency };
        return `Added income source: ${sourceName} with amount: ${amount} gold (${frequency})`;
    }

    removeIncomeSource(sourceName) {
        if (this.incomeSources[sourceName]) {
            delete this.incomeSources[sourceName];
            return `Removed income source: ${sourceName}`;
        }
        return `Income source ${sourceName} not found`;
    }

    calculateTotalIncome(days = 1) {
        let totalIncome = 0;
        for (const source in this.incomeSources) {
            const { amount, frequency } = this.incomeSources[source];
            switch (frequency) {
                case 'daily':
                    totalIncome += amount * days;
                    break;
                case 'weekly':
                    totalIncome += amount * (days / 7);
                    break;
                case 'monthly':
                    totalIncome += amount * (days / 30);
                    break;
            }
        }
        return totalIncome * (1 - this.taxRate);
    }

    takeLoan(amount, interestRate, termInDays) {
        if (amount > 0) {
            this.loans.push({ amount, interestRate, termInDays, dateTaken: new Date() });
            this.gold += amount;
            this.transactions.push({ type: 'loan', amount, date: new Date() });
            return `Took a loan of ${amount} gold at ${interestRate}% interest for ${termInDays} days.`;
        }
        return 'Invalid loan amount.';
    }

    repayLoan(index, amount) {
        if (index >= 0 && index < this.loans.length) {
            const loan = this.loans[index];
            if (amount > 0 && amount <= this.gold) {
                loan.amount -= amount;
                this.gold -= amount;
                this.transactions.push({ type: 'loan repayment', amount, date: new Date() });
                if (loan.amount <= 0) {
                    this.loans.splice(index, 1);
                    return `Loan fully repaid. Remaining gold: ${this.gold.toFixed(2)}`;
                }
                return `Repaid ${amount} gold towards loan. Remaining loan amount: ${loan.amount.toFixed(2)}`;
            }
            return 'Invalid repayment amount or insufficient gold.';
        }
        return 'Invalid loan index.';
    }

    invest(amount, expectedReturn, riskLevel) {
        if (amount > 0 && amount <= this.gold) {
            this.gold -= amount;
            this.investments.push({ amount, expectedReturn, riskLevel, dateInvested: new Date() });
            this.transactions.push({ type: 'investment', amount, date: new Date() });
            return `Invested ${amount} gold with expected return of ${expectedReturn}% (Risk level: ${riskLevel})`;
        }
        return 'Invalid investment amount or insufficient gold.';
    }

    collectInvestmentReturns(index) {
        if (index >= 0 && index < this.investments.length) {
            const investment = this.investments[index];
            const returns = investment.amount * (1 + investment.expectedReturn / 100);
            this.gold += returns;
            this.transactions.push({ type: 'investment return', amount: returns, date: new Date() });
            this.investments.splice(index, 1);
            return `Collected ${returns.toFixed(2)} gold from investment. Total gold: ${this.gold.toFixed(2)}`;
        }
        return 'Invalid investment index.';
    }

    applyInflation(years = 1) {
        const inflationFactor = Math.pow(1 + this.inflation, years);
        this.gold /= inflationFactor;
        return `Applied ${years} years of inflation. New gold value: ${this.gold.toFixed(2)}`;
    }

    getBalance() {
        return this.gold.toFixed(2);
    }

    getTransactions() {
        return this.transactions;
    }

    getLoanSummary() {
        return this.loans.map(loan => ({
            amount: loan.amount,
            interestRate: loan.interestRate,
            remainingDays: loan.termInDays - Math.floor((new Date() - loan.dateTaken) / (1000 * 60 * 60 * 24))
        }));
    }

    getInvestmentSummary() {
        return this.investments.map(inv => ({
            amount: inv.amount,
            expectedReturn: inv.expectedReturn,
            riskLevel: inv.riskLevel,
            daysInvested: Math.floor((new Date() - inv.dateInvested) / (1000 * 60 * 60 * 24))
        }));
    }
}

// Example usage:
const playerGold = new GoldSystem(100);
console.log(playerGold.earnGold(50, 'Job'));
console.log(playerGold.spendGold(30, 'Education'));
console.log(playerGold.addIncomeSource('Business', 10, 'daily'));
console.log(playerGold.takeLoan(200, 5, 30));
console.log(playerGold.invest(50, 10, 'medium'));
console.log(playerGold.getBalance());
