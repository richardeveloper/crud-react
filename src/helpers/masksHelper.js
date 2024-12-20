export const masksHelper = () => {

    const applyMaskMoney = (money) => {
        money = parseFloat(money).toFixed(2);
        money = money.replace('.', ',');
    
        return `R$ ${money}`;
    }

    const applyMaskPhone = (phone) => {
        const ddd = phone.substring(0, 2);
        const first = phone.substring(2, 7);
        const second = phone.substring(7, phone.length);
    
        return `(${ddd}) ${first}-${second}`;
    }

    const applyEventMaskPhone = (event) => {
        let value = event.target.value.replace(/\D/g, '');
    
        switch (value.length) {
            case 1:
            case 2:
                value = value.replace(/^(\d{2})$/, '($1');
                break;
            case 3:
            case 4:
                value = value.replace(/^(\d{2})(\d{1,2})$/, '($1) $2');
                break;
            case 5:
            case 6:
                value = value.replace(/^(\d{2})(\d{3,4})$/, '($1) $2');
                break;
            case 7:
            case 8:
                value = value.replace(/^(\d{2})(\d{4,5})(\d{1,2})$/, '($1) $2-$3');
                break;
            case 9:
            case 10:
                value = value.replace(/^(\d{2})(\d{5})(\d{2,3})$/, '($1) $2-$3');
                break;
            case 11:
                value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                break;
            default:
                break;
        }

        return value;
    }

    return {
        applyMaskMoney,
        applyMaskPhone,
        applyEventMaskPhone
    };

}