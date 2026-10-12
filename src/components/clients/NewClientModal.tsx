import React, { useState } from 'react';
import { Client, SizeShirt, SizePants, SizeShoes, FitPreference, ClientTier } from '../../types/crm';
import { 
  X, 
  User, 
  Ruler, 
  Palette, 
  MapPin, 
  Phone, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: Client) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onAddClient
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [city, setCity] = useState('Canoinhas');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [address, setAddress] = useState('');
  const [profession, setProfession] = useState('');
  const [tier, setTier] = useState<ClientTier>('Novo Cliente');

  // Anthropometry
  const [shirt, setShirt] = useState<SizeShirt>('M');
  const [pants, setPants] = useState<SizePants>('42');
  const [shoes, setShoes] = useState<SizeShoes>('41');
  const [fitPreference, setFitPreference] = useState<FitPreference>('Slim Fit');
  const [heightCm, setHeightCm] = useState<string>('180');
  const [weightKg, setWeightKg] = useState<string>('78');

  // Style
  const [paletteStr, setPaletteStr] = useState('Tons Terrosos, Azul Marinho, Areia');
  const [lifestyle, setLifestyle] = useState('');
  const [curatorNote, setCuratorNote] = useState('');
  const [preferredCurator, setPreferredCurator] = useState('Mateus (Consultor Sênior)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Preencha ao menos o Nome e WhatsApp do cliente.');
      return;
    }

    const palette = paletteStr.split(',').map(s => s.trim()).filter(Boolean);

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      instagram: instagram.trim(),
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      address: address.trim() || 'Centro',
      tier,
      sizes: {
        shirt,
        pants,
        shoes,
        fitPreference,
        heightCm: heightCm ? Number(heightCm) : undefined,
        weightKg: weightKg ? Number(weightKg) : undefined
      },
      style: {
        palette: palette.length > 0 ? palette : ['Neutros', 'Preto'],
        favoriteCategories: ['Camisas de Linho', 'Calça Chino'],
        avoidItems: ['Estampas chamativas'],
        lifestyle: lifestyle.trim() || 'Profissional e eventos sociais em Canoinhas.',
        profession: profession.trim() || 'Empresário / Profissional Liberal'
      },
      styleTags: ['Clássico', 'Moderno'],
      customTags: ['Novo Cliente', 'Canoinhas'],
      metrics: {
        totalLtv: 0,
        ordersCount: 0,
        condicionaisCount: 0,
        condicionalConversionRate: 0,
        averageTicket: 0,
        lastInteractionDate: new Date().toISOString()
      },
      purchasedPieces: [],
      returnedPieces: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          type: 'VISITA_LOJA',
          title: 'Cadastro no Ravis CRM',
          description: `Novo cliente cadastrado com caimento ${fitPreference} e medidas P/M/G.`,
          timestamp: new Date().toLocaleDateString('pt-BR')
        }
      ],
      curatorNotes: curatorNote.trim() ? [curatorNote.trim()] : ['Novo cliente cadastrado no chão de loja.'],
      preferredCurator,
      createdAt: new Date().toISOString()
    };

    onAddClient(newClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10141d] border border-[#273245] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212a3b] bg-[#141924] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c99738]/20 border border-[#c99738]/40 flex items-center justify-center text-[#c99738]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Cadastrar Novo Cliente VIP</h2>
              <p className="text-xs text-neutral-400">Ficha antropométrica, estilo e preferências de condicional</p>
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Dados Básicos */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-neutral-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#c99738]" />
              <span>Identificação & Contato</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-400 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dr. Marcelo Silveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">WhatsApp Business *</label>
                <input
                  type="text"
                  required
                  placeholder="(47) 99999-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Profissão / Ocupação</label>
                <input
                  type="text"
                  placeholder="Ex: Advogado / Produtor Rural"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Instagram (@)</label>
                <input
                  type="text"
                  placeholder="@cliente"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Cidade / Região</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
                >
                  <option value="Canoinhas">Canoinhas - SC</option>
                  <option value="Três Barras">Três Barras - SC</option>
                  <option value="Mafra">Mafra - SC</option>
                  <option value="Porto União">Porto União - SC</option>
                  <option value="Irineópolis">Irineópolis - SC</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Endereço de Entrega da Mala</label>
                <input
                  type="text"
                  placeholder="Rua, número, apto e bairro"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
                />
              </div>
            </div>
          </div>

          {/* Ficha Antropométrica */}
          <div className="space-y-2.5 pt-3 border-t border-[#1d2536]">
            <h3 className="font-semibold text-neutral-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-[#c99738]" />
              <span>Tamanhos & Caimento Pessoal</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0c0f16] p-3 rounded-xl border border-[#1b2230]">
              <div>
                <label className="text-neutral-400 block mb-1">Camisa / Blazer:</label>
                <select
                  value={shirt}
                  onChange={(e: any) => setShirt(e.target.value)}
                  className="w-full bg-[#141923] border border-[#283447] rounded-lg px-2.5 py-1.5 text-[#f5d061] font-bold"
                >
                  <option value="P">Tamanho P</option>
                  <option value="M">Tamanho M</option>
                  <option value="G">Tamanho G</option>
                  <option value="GG">Tamanho GG</option>
                  <option value="XG">Tamanho XG</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Calça / Bermuda:</label>
                <select
                  value={pants}
                  onChange={(e: any) => setPants(e.target.value)}
                  className="w-full bg-[#141923] border border-[#283447] rounded-lg px-2.5 py-1.5 text-[#f5d061] font-bold"
                >
                  <option value="38">Tamanho 38</option>
                  <option value="40">Tamanho 40</option>
                  <option value="42">Tamanho 42</option>
                  <option value="44">Tamanho 44</option>
                  <option value="46">Tamanho 46</option>
                  <option value="48">Tamanho 48</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Calçado / Loafer:</label>
                <select
                  value={shoes}
                  onChange={(e: any) => setShoes(e.target.value)}
                  className="w-full bg-[#141923] border border-[#283447] rounded-lg px-2.5 py-1.5 text-[#f5d061] font-bold"
                >
                  <option value="39">Número 39</option>
                  <option value="40">Número 40</option>
                  <option value="41">Número 41</option>
                  <option value="42">Número 42</option>
                  <option value="43">Número 43</option>
                  <option value="44">Número 44</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Caimento Favorito:</label>
                <select
                  value={fitPreference}
                  onChange={(e: any) => setFitPreference(e.target.value)}
                  className="w-full bg-[#141923] border border-[#283447] rounded-lg px-2.5 py-1.5 text-emerald-400 font-semibold"
                >
                  <option value="Slim Fit">Slim Fit</option>
                  <option value="Regular Fit">Regular Fit</option>
                  <option value="Alfaiataria Moderna">Alfaiataria Moderna</option>
                  <option value="Longline">Longline</option>
                  <option value="Oversized Minimalista">Oversized</option>
                </select>
              </div>
            </div>
          </div>

          {/* DNA de Estilo & Curadoria */}
          <div className="space-y-2.5 pt-3 border-t border-[#1d2536]">
            <h3 className="font-semibold text-neutral-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#c99738]" />
              <span>Preferências de Estilo & Notas da Curadoria</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-400 block mb-1">Cores Preferidas (separadas por vírgula):</label>
                <input
                  type="text"
                  value={paletteStr}
                  onChange={(e) => setPaletteStr(e.target.value)}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Curador Preferido:</label>
                <select
                  value={preferredCurator}
                  onChange={(e) => setPreferredCurator(e.target.value)}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
                >
                  <option value="Mateus (Consultor Sênior)">Mateus (Consultor Sênior)</option>
                  <option value="Juliana (Consultora VIP)">Juliana (Consultora VIP)</option>
                  <option value="Ravi (Curador-Chefe)">Ravi (Curador-Chefe)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-neutral-400 block mb-1">Notas Privadas do Curador / Particularidades:</label>
                <input
                  type="text"
                  placeholder="Ex: Não gosta de gola polo tradicional, prefere linho lavado..."
                  value={curatorNote}
                  onChange={(e) => setCuratorNote(e.target.value)}
                  className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1a212e] text-neutral-300 hover:bg-[#232b3b]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#c99738] to-[#b3822b] hover:from-[#d8a542] hover:to-[#be8d35] text-black font-semibold shadow-md shadow-[#c99738]/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Salvar Cliente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
