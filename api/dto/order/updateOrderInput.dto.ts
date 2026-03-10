import { IsString, IsISO8601, IsNumber, IsNotEmpty, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";

class ItemInput {
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

export default class UpdateOrderInput {
    // Há formas mais eficientes e globalizadas de se traduzir as mensagens de erro
    // mas foi me dado 3 dias de prazo para fazer o desafio incluindo sabado e domingo
    // tenham piedade desta alma que vos escreve

    /*------------------------------------------------------------------------*/
    @IsString({ message: "O campo $property deve ser do tipo alfanumérico" })
    @IsNotEmpty({ message: "O campo $property não pode ser nulo" })
    numeroPedido: string;
    /*------------------------------------------------------------------------*/


    /*------------------------------------------------------------------------*/
    @IsNumber({}, { message: "O campo $property deve ser numérico" })
    @IsNotEmpty({ message: "O campo $property não pode ser nulo" })
    valorTotal: number;
    /*------------------------------------------------------------------------*/


    /*------------------------------------------------------------------------*/
    @IsISO8601({}, { message: "O campo $property deve estar no formato ISO8601" })
    @IsNotEmpty({ message: "O campo $property não pode ser nulo" })
    dataCriacao: string;
    /*------------------------------------------------------------------------*/

    @IsNotEmpty({ message: "O campo $property não pode ser nulo" })
    @ValidateNested({ each: true })
    @Type(() => ItemInput)
    @IsArray()
    items: ItemInput[]
}