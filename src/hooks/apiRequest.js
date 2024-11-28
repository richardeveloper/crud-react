import { toast } from "react-toastify";

export const apiRequest = async (url, options = {}) => {
    try {
        const response = await fetch(`${url}`, options);
        
        if (!response.ok) {
            const dataError = await response.json();
            throw dataError;
        }

        if (response.status === 204) {
            return;
        }

        const data = await response.json();

        return data;

    } catch (error) {

        if (error.invalidFields) {
            error.invalidFields.map((invalidField) => {
                return toast.warning(invalidField.message);
            });
            throw error;
        }
        else {
            const message = error.message ? error.message : 'Ocorreu um erro ao buscar produto por nome.'
            toast.error(message);
            throw error;
        }
    }
}