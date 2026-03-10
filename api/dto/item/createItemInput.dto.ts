import { IsEmpty, IsNotEmpty, IsNumber } from "class-validator";

export default class CreateItemInput {

    // Há formas mais eficientes e globalizadas de se traduzir as mensagens de erro
    // mas foi me dado 3 dias de prazo para fazer o desafio incluindo sabado e domingo
    // tenham piedade desta alma que vos escreve

    /*------------------------------------------------------------------------*/
    @IsNumber({}, { message: "O campo $property deve ser numérico" })
    @IsNotEmpty({ message: "O campo $property não pode ser nulo" })
    idItem: number;
    /*------------------------------------------------------------------------*/


    /*------------------------------------------------------------------------*/
    @IsNumber({}, { message: "O campo $property deve ser numérico" })
    @IsNotEmpty({ message: "O campo $property não pode ser nulo" })
    quantidadeItem: number;
    /*------------------------------------------------------------------------*/


    /*------------------------------------------------------------------------*/
    @IsNumber({}, { message: "O campo $property deve ser numérico" })
    @IsNotEmpty({ message: "O campo $property não pode ser nulo" })
    valorItem: number
    /*------------------------------------------------------------------------*/

}