document.getElementById('calcul-btn').addEventListener('click', () => {
    const socialFormValue = document.getElementById('social-form-input').value;
    const vehicleKmValue = parseInt(document.getElementById('vehicle-km').value);
    const vehicleValue = document.getElementById('vehicle-input').value;
    const vehicleCvValue = parseInt(document.getElementById('vehicle-cv').value);
    const totalHousingM2Value = parseInt(document.getElementById('total-housing-m2').value);
    const housingRentValue = parseInt(document.getElementById('housing-rent').value);
    const professionnalHousingM2Value = parseInt(document.getElementById('profesionnal-housing-m2').value);
    const formationBooleanValue = document.getElementById('formation-input').value;
    const formationHoursValue = parseInt(document.getElementById('formation-hours').value);
    const perAmountValue = parseInt(document.getElementById('per-amount').value);
    const perInterestValue = parseInt(document.getElementById('per-interest').value);
    const shareholderCurrentAccountAmountValue = parseInt(document.getElementById('shareholder-current-account-amount').value);
    const shareholderCurrentAccountInterestValue = parseInt(document.getElementById('shareholder-current-account-interest').value);

    let perEconomyAmount;

    if (socialFormValue === 'micro' || socialFormValue === 'sasu') {
        perEconomyAmount = 0;
    } else {
        perEconomyAmount = calculPerEconomy(perAmountValue, perInterestValue);
    }

    let formationEconomyTotalAmount;
    
    if (formationBooleanValue === 'oui') {
        formationEconomyTotalAmount = calculFormationEconomy(formationHoursValue);
    } else {
        formationEconomyTotalAmount = 0;
    }

    let vacationVouchersEconomyAmount;
    let serviceVouchersEconomyAmount;
    let shareholderCurrentAccountEconomyAmount;

    if (socialFormValue === 'sasu' || socialFormValue === 'eurl') {
        vacationVouchersEconomyAmount = 500;
        serviceVouchersEconomyAmount = 2500;
        shareholderCurrentAccountEconomyAmount = calculShareholderCurrentAccountEconomy(shareholderCurrentAccountAmountValue, shareholderCurrentAccountInterestValue);
    } else {
        vacationVouchersEconomyAmount = 0;
        serviceVouchersEconomyAmount = 0;
        shareholderCurrentAccountEconomyAmount = 0;
    }

    let kilometricAllowancesEconomyAmount;

    if (vehicleValue === 'car') {
        kilometricAllowancesEconomyAmount = calculKilometricAllowancesEconomy(vehicleKmValue, vehicleCvValue);
    } else if (vehicleValue === 'motorcycle') {
        kilometricAllowancesEconomyAmount = calculKilometricAllowancesMotorcycle(vehicleKmValue, vehicleCvValue);
    } else if (vehicleValue === 'scooter') {
        kilometricAllowancesEconomyAmount = calculKilometricAllowancesScooter(vehicleKmValue);
    }

    let housingEconomyAmount;

    if (socialFormValue === 'micro') {
        housingEconomyAmount = 0;
    } else {
        housingEconomyAmount = calculHousingEconomy(totalHousingM2Value, housingRentValue, professionnalHousingM2Value);
    }

    let totalEconomyAmount = housingEconomyAmount + perEconomyAmount + shareholderCurrentAccountEconomyAmount + formationEconomyTotalAmount + vacationVouchersEconomyAmount + serviceVouchersEconomyAmount + kilometricAllowancesEconomyAmount;

    console.log('Kilometric allowance economy : ' + kilometricAllowancesEconomyAmount);
    console.log('Housing economy : ' + housingEconomyAmount);
    console.log('PER economy : ' + perEconomyAmount);
    console.log('Shareholder current account economy : ' + shareholderCurrentAccountEconomyAmount);
    console.log('Formation economy : ' + formationEconomyTotalAmount);
    console.log('Vacation Vouchers economy : ' + vacationVouchersEconomyAmount);
    console.log('Service Vouchers economy : ' + serviceVouchersEconomyAmount);
    console.log('Total economy : ' + totalEconomyAmount);

    fillResultTexts(totalEconomyAmount, kilometricAllowancesEconomyAmount, formationEconomyTotalAmount, housingEconomyAmount, shareholderCurrentAccountEconomyAmount, perEconomyAmount, vacationVouchersEconomyAmount, serviceVouchersEconomyAmount);
});

function fillResultTexts(totalEconomyAmount, kilometricAllowancesEconomyAmount, formationEconomyTotalAmount, housingEconomyAmount, shareholderCurrentAccountEconomyAmount, perEconomyAmount, vacationVouchersEconomyAmount, serviceVouchersEconomyAmount) {
    document.getElementById('total-economy-amount').textContent = totalEconomyAmount;
    document.getElementById('vehicle-economy-amount').textContent = kilometricAllowancesEconomyAmount;
    document.getElementById('formation-economy-amount').textContent = formationEconomyTotalAmount;
    document.getElementById('rent-economy-amount').textContent = housingEconomyAmount;
    document.getElementById('shareholder-account-economy-amount').textContent = shareholderCurrentAccountEconomyAmount;
    document.getElementById('per-economy-amount').textContent = perEconomyAmount;
    document.getElementById('vacation-vouchers-economy-amount').textContent = vacationVouchersEconomyAmount;
    document.getElementById('service-vouchers-economy-amount').textContent = serviceVouchersEconomyAmount;
}


function calculKilometricAllowancesEconomy(vehicleKmValue, vehicleCvValue) {
    let allowanceEconomyAmount;

    if (vehicleKmValue <= 5000) {
        switch (true) {
            case vehicleCvValue <= 3:
                allowanceEconomyAmount = vehicleKmValue * 0.529;
                break;
            case vehicleCvValue === 4:
                allowanceEconomyAmount = vehicleKmValue * 0.606;
                break;
            case vehicleCvValue === 5:
                allowanceEconomyAmount = vehicleKmValue * 0.636;
                break;
            case vehicleCvValue === 6:
                allowanceEconomyAmount = vehicleKmValue * 0.665;
                break;
            case vehicleCvValue >= 7:
                allowanceEconomyAmount = vehicleKmValue * 0.697;
                break;
            default:
                throw new Error("CV non pris en charge");
        }
    } else if (vehicleKmValue > 5000 && vehicleKmValue <= 20000) {
        switch (true) {
            case vehicleCvValue <= 3:
                allowanceEconomyAmount = (5000 * 0.529) + (((vehicleKmValue - 5000) * 0.316) + 1065);
                break;
            case vehicleCvValue === 4:
                allowanceEconomyAmount = (5000 * 0.606) + (((vehicleKmValue - 5000) * 0.340) + 1330);
                break;
            case vehicleCvValue === 5:
                allowanceEconomyAmount = (5000 * 0.636) + (((vehicleKmValue - 5000) * 0.357) + 1395);
                break;
            case vehicleCvValue === 6:
                allowanceEconomyAmount = (5000 * 0.665) + (((vehicleKmValue - 5000) * 0.374) + 1457);
                break;
            case vehicleCvValue >= 7:
                allowanceEconomyAmount = (5000 * 0.697) + (((vehicleKmValue - 5000) * 0.394) + 1515);
                break;
            default:
                throw new Error("CV non pris en charge");
        }
    } else if (vehicleKmValue > 20000) {
        switch (true) {
            case vehicleCvValue <= 3:
                allowanceEconomyAmount = (5000 * 0.529) + (((20000 - 5000) * 0.316) + 1065) + ((vehicleKmValue - 20000) * 0.370);
                break;
            case vehicleCvValue === 4:
                allowanceEconomyAmount = (5000 * 0.606) + (((20000 - 5000) * 0.340) + 1330) + ((vehicleKmValue - 20000) * 0.407);
                break;
            case vehicleCvValue === 5:
                allowanceEconomyAmount = (5000 * 0.636) + (((20000 - 5000) * 0.357) + 1395) + ((vehicleKmValue - 20000) * 0.427);
                break;
            case vehicleCvValue === 6:
                allowanceEconomyAmount = (5000 * 0.665) + (((20000 - 5000) * 0.374) + 1457) + ((vehicleKmValue - 20000) * 0.447);
                break;
            case vehicleCvValue >= 7:
                allowanceEconomyAmount = (5000 * 0.697) + (((20000 - 5000) * 0.394) + 1515) + ((vehicleKmValue - 20000) * 0.470);
                break;
            default:
                throw new Error("CV non pris en charge");
        }
    }

    return allowanceEconomyAmount;
}

function calculKilometricAllowancesMotorcycle(vehicleKmValue, vehicleCvValue) {
    let allowanceEconomyAmount;

    if (vehicleKmValue <= 3000) {
        switch (true) {
            case vehicleCvValue <= 2:
                allowanceEconomyAmount = vehicleKmValue * 0.395;
                break;
            case vehicleCvValue >= 3 && vehicleCvValue <= 5:
                allowanceEconomyAmount = vehicleKmValue * 0.468;
                break;
            case vehicleCvValue > 5:
                allowanceEconomyAmount = vehicleKmValue * 0.606;
                break;
            default:
                throw new Error("CV non pris en charge");
        }
    } else if (vehicleKmValue > 3000 && vehicleKmValue <= 6000) {
        switch (true) {
            case vehicleCvValue <= 2:
                allowanceEconomyAmount = (3000 * 0.395) + ((vehicleKmValue - 3000) * 0.099) + 891;
                break;
            case vehicleCvValue >= 3 && vehicleCvValue <= 5:
                allowanceEconomyAmount = (3000 * 0.468) + ((vehicleKmValue - 3000) * 0.082) + 1158;
                break;
            case vehicleCvValue > 5:
                allowanceEconomyAmount = (3000 * 0.606) + ((vehicleKmValue - 3000) * 0.079) + 1583;
                break;
            default:
                throw new Error("CV non pris en charge");
        }
    } else if (vehicleKmValue > 6000) {
        switch (true) {
            case vehicleCvValue <= 2:
                allowanceEconomyAmount = (3000 * 0.395) + ((3000 * 0.099) + 891) + ((vehicleKmValue - 6000) * 0.248);
                break;
            case vehicleCvValue >= 3 && vehicleCvValue <= 5:
                allowanceEconomyAmount = (3000 * 0.468) + ((3000 * 0.082) + 1158) + ((vehicleKmValue - 6000) * 0.275);
                break;
            case vehicleCvValue > 5:
                allowanceEconomyAmount = (3000 * 0.606) + ((3000 * 0.079) + 1583) + ((vehicleKmValue - 6000) * 0.343);
                break;
            default:
                throw new Error("CV non pris en charge");
        }
    }

    return allowanceEconomyAmount;
}

function calculKilometricAllowancesScooter(vehicleKmValue) {
    let allowanceScooterAmount;

    if (vehicleKmValue <= 3000) {
        allowanceScooterAmount = vehicleKmValue * 0.315;
    } else if (vehicleKmValue > 3000 && vehicleKmValue <= 6000) {
        allowanceScooterAmount = (3000 * 0.315) + (((vehicleKmValue - 3000) * 0.079) + 711);
    } else if (vehicleKmValue > 6000) {
        allowanceScooterAmount = (3000 * 0.315) + (((6000 - 3000) * 0.079) + 711) + ((vehicleKmValue - 6000) * 0.198);
    } else {
        throw new Error("Distance non prise en charge");
    }

    return allowanceScooterAmount;
}

function calculHousingEconomy(totalHousingM2Value, housingRentValue, professionnalHousingM2Value) {
    const housingEconomyAmount = (professionnalHousingM2Value / totalHousingM2Value) * housingRentValue;

    return housingEconomyAmount;
}

function calculFormationEconomy(formationHoursValue) {
    let formationEconomyAmount;

    if (formationHoursValue > 20) {
        formationEconomyAmount = 460;
    } else {
        formationEconomyAmount = (460 / 20) * formationHoursValue;
    }

    return formationEconomyAmount;
}

function calculPerEconomy(perAmountValue, perInterestValue) {
    if (perAmountValue > 4500) {
        perAmountValue = 4500;
    }

    const perEconomyAmount = perAmountValue * (perInterestValue / 100);

    return perEconomyAmount;
}

function calculShareholderCurrentAccountEconomy(shareholderCurrentAccountAmountValue, shareholderCurrentAccountInterestValue) {
    if (shareholderCurrentAccountInterestValue > 5) {
        shareholderCurrentAccountInterestValue = 5;
    }

    const shareholderCurrentAccountEconomyAmount = shareholderCurrentAccountAmountValue * (shareholderCurrentAccountInterestValue / 100);

    return shareholderCurrentAccountEconomyAmount;
}

