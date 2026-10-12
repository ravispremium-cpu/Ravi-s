import React, { useState } from 'react';
import { Product, FitPreference } from '../../types/crm';
import { 
  X, 
  Layers, 
  Plus, 
  Check, 
  Scissors, 
  Tag 
} from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Product['category']>('Camisas');
  const [price, setPrice] = useState<string>('580');
  const [costPrice, setCostPrice] = useState<string>('210');
  const [material, setMaterial] = useState('100% Linho Francês');
  const [color, setColor] = useState('Areia');
  const [fitType, setFitType] = useState<FitPreference>('Slim Fit');
  const [limitedEditionCount, setLimitedEditionCount] = useState<number>(20);
  const [description, setDescription] = useState('Modelagem exclusiva Ravi\'s Premium.');

  // Stock counts by size
  const [stockP, setStockP] = useState<number>(4);
  const [stockM, setStockM] = useState<number>(8);
  const [stockG, setStockG] = useState<number>(6);
  const [stockGG, setStockGG] = useState<number>(2);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const code = `RAV-${category.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const stockBySize: Product['stockBySize'] = {
      P: { total: stockP, reserved: 0, available: stockP },
      M: { total: stockM, reserved: 0, available: stockM },
      G: { total: stockG, reserved: 0, available: stockG },
      GG: { total: stockGG, reserved: 0, available: stockGG }
    };

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      code,
      title: title.trim(),
      category,
      price: Number(price) || 450,
      costPrice: Number(costPrice) || 180,
      material: material.trim(),
      color: color.trim(),
      fitType,
      limitedEditionCount: Number(limitedEditionCount) || 20,
      description: description.trim(),
      tag: `Edição Limitada ${limitedEditionCount} Peças`,
      imageAccent: '#c99738',
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
      stockBySize
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10141d] border border-[#273245] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212a3b] bg-[#141924] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c99738]/20 border border-[#c99738]/40 flex items-center justify-center text-[#c99738]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Nova Peça de Edição Limitada</h2>
              <p className="text-xs text-neutral-400">Cadastre a curadoria com controle de estoque por tamanho</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1a212e] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-neutral-400 block mb-1">Título da Peça *</label>
              <input
                type="text"
                required
                placeholder="Ex: Camisa Linho Puro Riviera Italiana"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
              >
                <option value="Camiseta Slim">Camiseta Slim</option>
                <option value="Camiseta Longline">Camiseta Longline</option>
                <option value="Tricô">Tricô & Malharia Nobre</option>
                <option value="Sobretudo">Sobretudo & Casacos</option>
                <option value="Cachecol">Cachecol & Acessórios</option>
                <option value="Calça">Calça de Alfaiataria</option>
                <option value="Camisas">Camisas</option>
                <option value="Blazers">Blazers & Alfaiataria</option>
                <option value="Calçados">Calçados & Loafers</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Caimento</label>
              <select
                value={fitType}
                onChange={(e: any) => setFitType(e.target.value)}
                className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-emerald-400 font-semibold focus:outline-none focus:border-[#c99738]"
              >
                <option value="Slim Fit">Slim Fit</option>
                <option value="Regular Fit">Regular Fit</option>
                <option value="Alfaiataria Moderna">Alfaiataria Moderna</option>
                <option value="Longline">Longline</option>
                <option value="Oversized Minimalista">Oversized</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Preço Venda (R$)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-[#f5d061] font-bold focus:outline-none focus:border-[#c99738]"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Tecido / Composição</label>
              <input
                type="text"
                placeholder="Ex: 100% Linho Francês"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
              />
            </div>
          </div>

          {/* Stock by size */}
          <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1d2536] space-y-2">
            <span className="text-[11px] font-semibold text-neutral-300 block uppercase tracking-wider">
              Grade de Estoque Inicial por Tamanho:
            </span>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <label className="text-neutral-400 block text-[10px] mb-1">Tam P</label>
                <input
                  type="number"
                  min="0"
                  value={stockP}
                  onChange={(e) => setStockP(Number(e.target.value))}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg p-1.5 text-center text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-neutral-400 block text-[10px] mb-1">Tam M</label>
                <input
                  type="number"
                  min="0"
                  value={stockM}
                  onChange={(e) => setStockM(Number(e.target.value))}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg p-1.5 text-center text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-neutral-400 block text-[10px] mb-1">Tam G</label>
                <input
                  type="number"
                  min="0"
                  value={stockG}
                  onChange={(e) => setStockG(Number(e.target.value))}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg p-1.5 text-center text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-neutral-400 block text-[10px] mb-1">Tam GG</label>
                <input
                  type="number"
                  min="0"
                  value={stockGG}
                  onChange={(e) => setStockGG(Number(e.target.value))}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg p-1.5 text-center text-white font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1a212e] text-neutral-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#c99738] to-[#b3822b] hover:from-[#d8a542] hover:to-[#be8d35] text-black font-semibold shadow-md shadow-[#c99738]/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Salvar no Catálogo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
