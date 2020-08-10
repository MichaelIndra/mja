import { ELoanType } from '../loan/loan.enum';

export async function calculateLoan(latestLoanPay: any, type: string, nominal: number): Promise<any> {
    try {
        if (Number(nominal) <= 0) {
            return null;
        }
        let loanPayData = {
            total_loan_before: 0,
            total_loan_current: 0,
            total_pay_before: 0,
            total_pay_current: 0,
        };
        if (latestLoanPay) {
            if (type.toUpperCase() === ELoanType.LOAN || type.toUpperCase() === ELoanType.REVERSE) {
                loanPayData = {
                    total_loan_before: Number(latestLoanPay.total_loan_current),
                    total_loan_current: Number(latestLoanPay.total_loan_current) + Number(nominal),
                    total_pay_before: Number(latestLoanPay.total_pay_before),
                    total_pay_current: Number(latestLoanPay.total_pay_current),
                };
            } else if (type.toUpperCase() === ELoanType.PAY) {
                if (Number(latestLoanPay.total_loan_current) === 0) {
                    return Promise.reject({ statusCode: 400, message: `Employee doesn't have loan` });
                } else if (Number(latestLoanPay.total_loan_current) - Number(nominal) < 0) {
                    return Promise.reject({ statusCode: 400, message: `TOTAL PAYMENT (nominal) is too much (Total Loan: ${latestLoanPay.total_loan_current}, Nominal: ${nominal})` });
                } else {
                    loanPayData = {
                    total_loan_before: Number(latestLoanPay.total_loan_current),
                    total_loan_current: Number(latestLoanPay.total_loan_current) - Number(nominal),
                    total_pay_before: Number(latestLoanPay.total_pay_current),
                    total_pay_current: Number(latestLoanPay.total_pay_current) + Number(nominal),
                    };
                }
            }
        } else {
            if (type.toUpperCase() === ELoanType.LOAN || type.toUpperCase() === ELoanType.REVERSE) {
                loanPayData = {
                    total_loan_before: 0,
                    total_loan_current: 0 + Number(nominal),
                    total_pay_before: 0,
                    total_pay_current: 0,
                };
            } else if (type.toUpperCase() === ELoanType.PAY) {
                return Promise.reject({ statusCode: 400, message: `Employee doesn't have loan` });
            }
        }
        return loanPayData;
    } catch (err) {
        return Promise.reject(err);
    }
}