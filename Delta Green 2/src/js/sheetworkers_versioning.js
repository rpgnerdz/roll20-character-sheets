const versioning = (version) => {
    console.log(`%c Versioning, ${version}`, 'color: green; font-weight:bold');
    if (version < 1.05) {
       version_0_105();
    } 
    if (version <1.5) {
        version_105_150();
    }
    if (version<1.7) {
        version_150_170();
    }
    if (version<2.0) {
        version_170_200();
    }
    if (version<2.01) {
        version_200_201();
    }
    if (version<2.02) {
        version_201_202();
    }
};

// UPDATE TO VERSION 1.05
const version_0_105= () => {
    getAttrs(['version'], function(v) {
        let codeversion=1.05;
        let update={version: codeversion,
                     initial_san: 0,
                     initial_hp:  0,
                     initial_str: 0,
                     initial_con: 0
        };
        setAttrs(update, //Update attributes
            {silent:true},  // will not trigger sheet workers
            versioning(codeversion)); // call versioning again
    });
};
// UPDATE TO VERSION 1.5
const version_105_150 = () => {

    let codeversion=1.5;
    let update={};

    getSectionIDs(`weapons`,function(idarray){
   console.log(`%c idarray`, 'color: green; font-weight:bold');
   console.info(idarray);
        let fieldnames=['sheet_type','version'];
        console.log(`%c did I found weapons?`, 'color: green; font-weight:bold');
        idarray.forEach(id => {
                console.log(`%c ${id}`, 'color: green; font-weight:bold');
                fieldnames.push(`repeating_weapons_${id}_damage`,`repeating_weapons_${id}_lethality_percent`,`repeating_weapons_${id}_attack`);
        });
           getAttrs(fieldnames,function(v) {
           console.log(`%c v`, 'color: green; font-weight:bold');
           console.info(v);
           update['version']=codeversion;

            idarray.forEach(id=>{
                console.log(`%c ${id}`, 'color: green; font-weight:bold');
                if (v[`repeating_weapons_${id}_damage`]===""){
                    update["repeating_weapons_"+id+"_hasDamage"]="0";

                } else{
                    update["repeating_weapons_"+id+"_hasDamage"]="1";

                }

                if (v[`repeating_weapons_${id}_lethality_percent`]>0){
                    update["repeating_weapons_"+id+"_hasLethality"]="1";

                } else {
                    update["repeating_weapons_"+id+"_hasLethality"]="0";

                }
                if (v['sheet_type']==='npc'){
                    update["repeating_weapons_"+id+"_weapons"]=v[`repeating_weapons_${id}_attack`];
                }
            });

           console.log(`%c update`, 'color: green; font-weight:bold');

            setAttrs(update, //Update attributes
                    {silent:true},  // will not trigger sheet workers
                    versioning(codeversion)); // call versioning again

        });
    });
};

// UPDATE TO VERSION 1.7
const version_150_170 = () => {
    let codeversion=1.7;
    let update={};
    update['version']=codeversion;
    update['luck']=50;
    update['luck_max']=50;
    console.log(`%c update`, 'color: green; font-weight:bold');

    setAttrs(update, //Update attributes
            {silent:true},  // will not trigger sheet workers
            versioning(codeversion)); // call versioning again
};

// UPDATE TO VERSION 2.0
const version_170_200 = () => {
    let codeversion=2.0;
    const update={};
    update['version']=codeversion;
    getAttrs(["motivations","character_name","name","sanity_points","violence_3","helplessness_3","violence_2","helplessness_2",
    "sanity_points_old","sanity_points","breaking_point_old","breaking_point_old"],function(v){
        let motivations=v["motivations"];
        if (v["name"]!==""){
            _name=v["name"];
        }else{
            _name=v["character_name"];
        }	
        update["character_name"]=_name;
        update["old_motivations"]=motivations.replace(/<br>/g,"\n");
        const _violence_adapted     = v["violence_2"]==='on';
        const _helplessness_adapted = v["helplessness_2"]==='on';
        if (v["violence_2"]==='on'){
            update["violence_1"]='on';
        }
        if (v["helplessness_2"]==='on'){
            update["helplessness_1"]='on';
        }

        if (_violence_adapted){
            update["violence_adapted"]=1;
            update["violence_2"]='on';
            update["violence_1"]='on';
        }
        if (_helplessness_adapted){
            update["helplessness_adapted"]=1;
            update["helplessness_2"]='on';
            update["helplessness_1"]='on';
        }

        update['sanity_points_old']=v['sanity_points'];
        update['breaking_point_old']=v['breaking_point'];

        console.log(`%c update`, 'color: green; font-weight:bold');

        setAttrs(update, //Update attributes
                {silent:true},  // will not trigger sheet workers
                versioning(codeversion)); // call versioning again
    });

};
// UPDATE TO VERSION 2.0
const version_200_201 = () => {
    let codeversion=2.01;
    const update={};
    console.log('version:',codeversion);
    update['version']=codeversion;

        // UPDATE NAMES FOR SPECIAL TRAINING AND WEAPONS AND TRIGGER TEST
    const _sectionDetails = [
        {section:'special', fields: ['name','special_training','skill_or_stat_used','skill_span',]},
        {section:'weapons', fields: ['name','weapons','rank','skill_percent','skill_span','ammo','hasammo','ammo_total','lethality_percent']},
        {section:'bonds', fields: ['flag','setScore','score','score_old']}];
    _sectionDetails.forEach(_group => {
        const section = _group.section;
        const fields = _group.fields;
        getSectionIDs(section, (ids)=>{
            console.log('in getSectionIDs section',section);
            console.log('in getSectionIDs ids',ids);
            const repfields=[];    
            ids.forEach(id => {
                fields.forEach(field => {
                    repfields.push(`repeating_${section}_${id}_${field}`);
                });
            });
            getAttrs(repfields,(values) => {
                    console.info('fullarray',values);
          
                    ids.forEach(id => {
                        const repsecid= `repeating_${section}_${id}_`;

                        /// bond update
                        if (section==='bonds'){
                            if (values.hasOwnProperty(`${repsecid}flag`)){
                                update[`${repsecid}setScore`]=1;
                                update[`${repsecid}flag`]='';
                            }
                            update[`${repsecid}score_old`]=values[`${repsecid}score`];
                            update[`${repsecid}test`]='editable';
                        }

                        if (section === 'weapons'){
                            if (values[`${repsecid}lethality_percent`]!==''){
                                const number=setMinMax(values[`${repsecid}lethality_percent`]);
                                update[`${repsecid}lethality_percent`]=number;
                                
                                console.log(`%c update name ${repsecid}lethality_percent to empty`, 'color: green; font-weight:bold');
                            }
                        }

                        if (section === 'special'){
                            if (values.hasOwnProperty(`${repsecid}special_training`)){
                                update[`${repsecid}name`]=values[`${repsecid}special_training`];
                                update[`${repsecid}special_training`]='';
                                console.log(`%c update name ${repsecid}special_training to ${repsecid}name`, 'color: green; font-weight:bold');
                            }
                        };

                        if (section === 'weapons'){
                            if (values.hasOwnProperty(`${repsecid}weapons`)){
                                update[`${repsecid}name`]=values[`${repsecid}weapons`];
                                update[`${repsecid}weapons`]='';
                                update[`${repsecid}test`]='editable';
                            }
                            const number=setMinMax(values[`${repsecid}skill_percent`]);
                            update[`${repsecid}skill_span`]=number;
                            update[`${repsecid}skill_percent`]=number;
                            const value_ammo = Math.max(parseInt(values[`${repsecid}ammo`],10) || 0,0)  ;
                            if (value_ammo>0){
                                update[`${repsecid}ammo_total`]=value_ammo;
                                update[`${repsecid}hasammo`]='active';
                                update[`${repsecid}ammo`]=value_ammo;
                            } else {
                                update[`${repsecid}hasammo`]=0;
                                update[`${repsecid}ammo_total`]='';
                                update[`${repsecid}ammo`]='';
                            }
                             
                            console.log(`%c update name ${repsecid}weapons to ${repsecid}name`, 'color: green; font-weight:bold');
                            
                        };

                        if (section ==='special'){
                            const value_stat=setMinMax(values[`${repsecid}skill_or_stat_used`]) ;
                            update[`${repsecid}skill_span`]=value_stat;
                            update[`${repsecid}skill_or_stat_used`]=value_stat;
                            console.log(`%c update skill_span for ${repsecid}`, 'color: green; font-weight:bold');
                        };

                        if (values.hasOwnProperty(`${repsecid}skill_percent`)){
                            const value_skill = setMinMax(values[`${repsecid}skill_percent`]);
                            update[`${repsecid}skill_span`]=value_skill;
                            update[`${repsecid}skill_percent`]=value_skill;
                            console.log(`%c update skill_span for ${repsecid}`, 'color: green; font-weight:bold');
                        };
                    }); 


                    console.log(`%c update`, 'color: green; font-weight:bold');
                    console.info('versioning',update);
                    setAttrs(update, //Update attributes
                            {silent:true},  // will not trigger sheet workers
                            versioning(codeversion)); // call versioning again

                        });

        });
    });
};

const version_201_202 = () => {
    let codeversion=2.02;
    const update={};
    console.log('verion:',codeversion);
    update['version']=codeversion;
    getAttrs(["sheet_type"], values => {
        var names=[];
        var rank=[];
                
        if (values.sheet_type==='npc'){
            update['sheet_type']='npc';
            getSectionIDs(`skills`, ids => {
                ids.forEach(id => {
                    names.push(`repeating_skills_${id}_name`);
                    rank.push(`repeating_skills_${id}_rank`);
                });
            });
        };        
            // make it into an object with keys = names and values = ran
               
            
        getAttrs(names.concat(rank), values => {
            var ids_to_remove=[]; // for the ids that I copy in the named skills
            names.forEach((name,idx) => {
                const skillname=values[name].toLowerCase().replace(/ /g, "_");
                const rankvalue=values[rank[idx]];
                const id_value=name.split('_')[2];
                if (arrays['_skills'].includes(skillname)){
                    update[`${skillname}`]=rankvalue;
                    update[`${skillname}_visible`]='visible';
                    ids_to_remove.push(id_value);
                }
            });
            console.info('update npc skills',update);
            
            setAttrs(update, {silent:true}, () => {
                console.log('updated skills');
                ids_to_remove.forEach(id => {
                    removeRepeatingRow(`repeating_skills_${id}`);
                });
                console.log('removed repeating skills');
                versioning(codeversion);
            });
            });
    });
}