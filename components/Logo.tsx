import { Wallet } from "lucide-react"; // ícone substituto do saco de dinheiro
import React from "react";

function Logo() {
    return (
        <a href="/" className="flex items-center gap-2">
            <Wallet className="h-11 w-11 stroke-green-600 stroke-[1.5]" />
            <p className="bg-gradient-to-r from-green-500 to-green-700
                bg-clip-text text-3xl font-bold leading-tight tracking-tighter
                text-transparent">
                FinanceManager
            </p>
        </a>
    );
}

export function LogoMobile() {
    return (
        <a href="/" className="flex items-center gap-2">
            <p className="bg-gradient-to-r from-green-500 to-green-700
                bg-clip-text text-3xl font-bold leading-tight tracking-tighter
                text-transparent">
                FinanceManager
            </p>
        </a>
    );
}

export default Logo;
