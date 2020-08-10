"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const loan_enum_1 = require("../loan/loan.enum");
function calculateLoan(latestLoanPay, type, nominal) {
    return __awaiter(this, void 0, void 0, function* () {
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
                if (type.toUpperCase() === loan_enum_1.ELoanType.LOAN || type.toUpperCase() === loan_enum_1.ELoanType.REVERSE) {
                    loanPayData = {
                        total_loan_before: Number(latestLoanPay.total_loan_current),
                        total_loan_current: Number(latestLoanPay.total_loan_current) + Number(nominal),
                        total_pay_before: Number(latestLoanPay.total_pay_before),
                        total_pay_current: Number(latestLoanPay.total_pay_current),
                    };
                }
                else if (type.toUpperCase() === loan_enum_1.ELoanType.PAY) {
                    if (Number(latestLoanPay.total_loan_current) === 0) {
                        return Promise.reject({ statusCode: 400, message: `Employee doesn't have loan` });
                    }
                    else if (Number(latestLoanPay.total_loan_current) - Number(nominal) < 0) {
                        return Promise.reject({ statusCode: 400, message: `TOTAL PAYMENT (nominal) is too much (Total Loan: ${latestLoanPay.total_loan_current}, Nominal: ${nominal})` });
                    }
                    else {
                        loanPayData = {
                            total_loan_before: Number(latestLoanPay.total_loan_current),
                            total_loan_current: Number(latestLoanPay.total_loan_current) - Number(nominal),
                            total_pay_before: Number(latestLoanPay.total_pay_current),
                            total_pay_current: Number(latestLoanPay.total_pay_current) + Number(nominal),
                        };
                    }
                }
            }
            else {
                if (type.toUpperCase() === loan_enum_1.ELoanType.LOAN || type.toUpperCase() === loan_enum_1.ELoanType.REVERSE) {
                    loanPayData = {
                        total_loan_before: 0,
                        total_loan_current: 0 + Number(nominal),
                        total_pay_before: 0,
                        total_pay_current: 0,
                    };
                }
                else if (type.toUpperCase() === loan_enum_1.ELoanType.PAY) {
                    return Promise.reject({ statusCode: 400, message: `Employee doesn't have loan` });
                }
            }
            return loanPayData;
        }
        catch (err) {
            return Promise.reject(err);
        }
    });
}
exports.calculateLoan = calculateLoan;
//# sourceMappingURL=loanCalculator.js.map