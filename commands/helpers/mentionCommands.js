const c = require('../../config/contacts_load');

const Mapa_comandos = new Map([
    /*--- Comandos Ajuda ---*/

    ['/bicho', {
        membros: [c.enrico, c.aranhas.celio, c.phasma.edgar]
    }],

    ['/milicia', {
        membros: [c.aranhas.celio, c.aranhas.gianlluca, c.mariposas.fischer, 
                  c.mariposas.luis_eduardo, c.formigas.davi, c.formigas.gabriel_rogerio, 
                  c.formigas.maycon, c.phasma.edgar, c.enrico, c.sapo.shiva, c.aves.jose_valerio],
        
        embaralhar: true,
        limite_membros: 5       // Limita o array de membros
    }],

    /*--- Comandos Principais ---*/

    ['/abelha', {
        membros: [c.abelhas.bruno_abelha, c.abelhas.bruno_aranda, c.abelhas.beatriz, c.staph.pedro_staph],
        
        adicionais: [ {usuario: c.enrico, chance: 0.3}]
    }],

    ['/aranha', {
        membros: [c.aranhas.adolfo, c.aranhas.alfredo, c.aranhas.claudia, c.aranhas.dayvson, 
                  c.aranhas.fernando, c.aranhas.gabriel_costa, c.aranhas.gabriel_vianna, 
                  c.aranhas.isaac, c.aranhas.lucas_gusso, c.aranhas.pedro_martins, c.aranhas.victor],

        prioridade: [c.aranhas.celio, c.aranhas.gianlluca, c.aranhas.jean, c.aranhas.ryan, c.aranhas.michelotto],

        adicionais: [ {usuario: c.enrico, chance: 0.2} ],

        embaralhar: true,
        limite_membros: 3
    }],

    ['/ave', {
        membros: [c.plantas.edvandro, c.aves.jose_valerio, c.aves.matheus_santos, 
                  c.borboletas.pedro_souza, c.aves.ruan],

        prioridade: [c.aves.leticia_keiko, c.aves.miguel_malta, c.aves.henrique_stranz],

        adicionais: [ {usuario: c.enrico, chance: 0.95},
                      {usuario: c.aves.victor_aves, chance: 0.3}],

        embaralhar: true,
        limite_membros: 3
    }],

    ['/barata', {
        membros: [c.mariposas.fischer, c.baratas.matheus_dora, c.phasma.pedro_alvaro],

        adicionais: [ {usuario: c.enrico, chance: 0.3},
                      {usuario: c.louva.lorena, chance: 0.2} ]
    }],

    ['/barbeiro', {
        membros: [c.carlos_adm, c.aranhas.celio],

        adicionais: [ {usuario: c.enrico, chance: 0.6} ]
    }],

    ['/besouro', {
        membros: [c.besouros.glauco, c.besouros.lorenne, c.besouros.vincenzo, c.besouros.bruno_begha],

        adicionais: [ {usuario: c.enrico, chance: 0.336} ]
    }],

    ['/bichopau', {
        membros: [c.phasma.edgar, c.phasma.pedro_alvaro, c.phasma.pedro_sisnando, c.phasma.phil],

        adicionais: [ {usuario: c.enrico, chance: 0.01} ]
    }],

    ['/borboleta', {
        membros: [c.borboletas.andre_nog, c.mariposas.jhonatan, 
                  c.borboletas.pedro_souza, c.borboletas.rafaela, 
                  c.borboletas.tiago],

        adicionais: [ {usuario: c.enrico, chance: 0.5},
                      {usuario: c.mariposas.fischer, chance: 0.15},
                      {usuario: c.borboletas.guilherme_augusto, chance: 0.1} ]
    }],

    ['/cigarra', {
        membros: [c.cigarras.bruno],

        adicionais: [ {usuario: c.enrico, chance: 0.2},
                      {usuario: c.mariposas.fischer, chance: 0.15} ]
    }],

    ['/cigarrinha', {
        membros: [c.cigarrinha.aline, c.cigarrinha.andre_cigarrinha, 
                  c.cigarrinha.eduardo_henrique],

        adicionais: [ {usuario: c.enrico, chance: 0.4} ]
    }],

    ['/cobra', {
        membros: [c.enrico, c.aves.jose_valerio, c.cobras.leonardo_conversano]
    }],

    ['/cupim', {
        membros: [c.cupim.gustavo, c.cupim.karina_lima, c.cupim.giordano],

        adicionais: [ {usuario: c.enrico, chance: 0.4} ]
    }],

    ['/diplopoda', {
        membros: [c.diplopoda.rodrigo_bouzan],

        adicionais: [ {usuario: c.enrico, chance: 0.5} ]
    }],

    ['/escorpiao', {
        membros: [c.aranhas.adolfo, c.aranhas.fernando, c.aranhas.gianlluca, 
                  c.aranhas.lucas_gusso, c.aranhas.pedro_martins],

        prioridade: [c.aranhas.celio, c.aranhas.jean, c.aranhas.michelotto],

        adicionais: [ {usuario: c.enrico, chance: 0.5} ],

        embaralhar: true,
        limite_membros: 3
    }],

    ['/formiga', {
        membros: [c.formigas.davi, c.formigas.felipe_santos, 
                  c.formigas.gabriel_rogerio, c.formigas.maycon],

        adicionais: [ {usuario: c.formigas.joao_paulo, chance: 0.1},
                      {usuario: c.formigas.diego, chance: 0.05},
                      {usuario: c.vankan, chance: 0.03},
                      {usuario: c.enrico, chance: 0.05} ]
    }],

    ['/formiga_leao', {
        membros: [c.formiga_leao.leon, c.formiga_leao.maria_girelli],

        adicionais: [ {usuario: c.enrico, chance: 0.3} ]
    }],

    ['/fungo', {
        membros: [c.fungos.mateus_ribeiro],

        adicionais: [ {usuario: c.enrico, chance: 0.7} ]
    }],

    ['/geoplanaria', {
        membros: [c.geoplanaria.piter],

        adicionais: [ {usuario: c.enrico, chance: 0.2} ]
    }],

    ['/grilo', {
        membros: [c.phasma.phil],

        adicionais: [ {usuario: c.enrico, chance: 0.7} ]
    }],

    ['/hemi', {
        membros: [c.cigarrinha.aline, c.cigarrinha.andre_cigarrinha, 
                  c.cigarrinha.eduardo_henrique, c.percevejos.guilherme_lopez],

        adicionais: [ {usuario: c.enrico, chance: 0.2} ]
    }],

    ['/lagarta', {
        membros: [c.borboletas.tiago, c.borboletas.pedro_souza, 
                  c.mariposas.fischer, c.mariposas.luis_eduardo, 
                  c.mariposas.nicolas]
    }],

    ['/lagarto', {
        membros: [c.lagartos.dani_alcantara, c.lagartos.joao_alcantara],

        adicionais: [ {usuario: c.enrico, chance: 0.6} ]
    }],

    ['/louva', {
        membros: [c.louva.bruno_louva, c.louva.cesar, c.louva.leo, 
                  c.louva.lorena, c.louva.lorram, c.louva.savio, c.louva.bombeiro],

        adicionais: [ {usuario: c.enrico, chance: 0.02},
                      {usuario: c.louva.gabriel_gomes, chance: 1} ],
        
        embaralhar: true,
        limite_membros: 4
    }],

    ['/mariposa', {
        membros: [c.mariposas.jhonatan, c.mariposas.miguel, 
                  c.phasma.pedro_alvaro, c.mariposas.pedro_lafin],

        prioridade: [c.mariposas.laila, c.mariposas.luis_eduardo, 
                     c.mariposas.nicolas],

        adicionais: [ {usuario: c.enrico, chance: 0.2},
                      {usuario: c.mariposas.fischer, chance: 1} ],
        
        embaralhar: true,
        limite_membros: 3
    }],

    ['/marinho', {
        membros: [c.marinho.carlos_sigma, c.aranhas.celio, 
                  c.marinho.rafael_masson, c.mosquitos.walther],

        adicionais: [ {usuario: c.enrico, chance: 0.4} ]
    }],

    ['/morcego', {
        membros: [c.aranhas.lucas_gusso],

        adicionais: [ {usuario: c.enrico, chance: 0.7} ]
    }],

    ['/mosca', {
        membros: [c.moscas.daniel_schelesky, c.moscas.lais, 
                  c.moscas.leonardo_breder, c.moscas.luan, 
                  c.moscas.matheus, c.moscas.rodrigo],

        adicionais: [ {usuario: c.enrico, chance: 0.1} ]
    }],

    ['/mosquito', {
        membros: [c.mosquitos.walther],

        adicionais: [ {usuario: c.enrico, chance: 0.7} ]
    }],

    ['/opiliao', {
        membros: [c.opilioes.lohan, c.opilioes.luis_cla, c.opilioes.thales],

        adicionais: [ {usuario: c.enrico, chance: 0.2} ]
    }],

    ['/percevejo', {
        membros: [c.percevejos.guilherme_lopez],

        adicionais: [ {usuario: c.enrico, chance: 0.8} ]
    }],

    ['/percevejo_aq', {
        membros: [c.percevejos.taoso],

        adicionais: [ {usuario: c.enrico, chance: 0.8} ]
    }],

    ['/planta', {
        membros: [c.plantas.edvandro, c.mariposas.fischer, c.plantas.thomaz_ricardo]
    }],

    ['/plec', {
        membros: [c.plecoptera.christian],

        adicionais: [ {usuario: c.enrico, chance: 0.8} ]
    }],

    ['/pseudo', {
        membros: [c.aranhas.dayvson],

        adicionais: [ {usuario: c.enrico, chance: 0.7} ]
    }],

    ['/monocot', {
        membros: [c.mariposas.fischer, c.formigas.joao_paulo, c.plantas.marcos]
    }],

    ['/dicot', {
        membros: [c.plantas.angelo_correa, c.plantas.bruno_santos, 
                  c.plantas.edvandro, c.opilioes.luis_cla]
    }],

    ['/rbn', {
        membros: [c.borboletas.andre_nog, c.abelhas.bruno_aranda, c.aranhas.celio,
                  c.phasma.edgar, c.enrico, c.aves.jose_valerio, c.rbn.tiago_rbn]
    }],

    ['/sapo', {
        membros: [c.sapo.allanis, c.sapo.catarina, c.sapo.shiva],

        adicionais: [ {usuario: c.enrico, chance: 0.5} ]
    }],

    ['/scoly', {
        membros: [c.formigas.gabriel_rogerio],

        adicionais: [ {usuario: c.enrico, chance: 0.7} ]
    }],

    ['/staph', {
        membros: [c.staph.pedro_staph],

        adicionais: [ {usuario: c.enrico, chance: 0.7} ]
    }],

    ['/strep', {
        membros: [c.formigas.gabriel_rogerio]
    }],

    ['/tipula', {
        membros: [c.mosquitos.walther],

        adicionais: [ {usuario: c.enrico, chance: 0.7} ]
    }],

    ['/traca', {
        membros: [c.sapo.shiva],

        adicionais: [ {usuario: c.enrico, chance: 0.1} ]
    }],

    ['/tripe', {
        membros: [c.tripe.marina],

        adicionais: [ {usuario: c.enrico, chance: 0.1} ]
    }],

    ['/vespa', {
        membros: [c.aranhas.celio, c.mariposas.laila, c.phasma.pedro_alvaro],

        adicionais: [ {usuario: c.enrico, chance: 0.3} ]
    }],
]);


module.exports = { Mapa_comandos };