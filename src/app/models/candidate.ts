import * as _ from 'lodash';
import { Vote } from './vote';
import * as SI from 'seamless-immutable';

/**
 *
 *
 **/




export interface ICandidate {
  id: string;
  name: string;
  photo: string;
  score: number;
  eliminated: boolean;
  removed: boolean;
  votes?: Vote[];
}


export class Candidate implements ICandidate {
  public eliminated: boolean = false;
  public removed: boolean = false;
  public score: number;
  public votes: Vote[];

  constructor(public id: string, public name: string, public photo: string){}
  
  public static mutable(input?:  Candidate | ICandidate): Candidate {

    if (input && input instanceof Candidate) {
      if (SI.isImmutable(input)){
        let imm: SeamlessImmutable.ImmutableObjectMethods<Candidate> = <SeamlessImmutable.ImmutableObjectMethods<Candidate>> input;
        return <Candidate> imm.asMutable({deep:true});
      } else return <Candidate> input;
    }

    if (!input) input = <ICandidate>{};

    let id = input && input.id ? input.id : '',
        name = input && input.name ? input.name : '',
        photo = input && input.photo ? input.photo : '';

    return new Candidate(id, name, photo);
  }

  public static immutable(input?: Candidate | ICandidate): ImmutableCandidate {
    return SI<Candidate>(Candidate.mutable(input), {prototype: Candidate.prototype});
  }
  
  public get isActive(){
    return ! ( this.eliminated || this.removed);
  }

  /**
   * todo rename up
   * @param toId
   * @returns {{}}
   */
  public getInboundAllyVotes(toId?: string):{[id:string]:number}  {
    let init: {[id:string]:number} = {};
    return this.votes.reduce((dict, vote)=>{
      let myChoice = vote.choices.indexOf(this.id);
      for (let i = 0; i < myChoice; i++){
        if (!dict[vote.choices[i]]) dict[vote.choices[i]] = 0;
        dict[vote.choices[i]] += 1; //= dict[vote.choices[i]] + 1;
      }
      return dict;
    }, init);
  }

  public getOutboundAllyVotes(toId?: string):{[id:string]:number}  {
    let init: {[id:string]:number} = {};
    return this.votes.reduce((dict, vote)=>{
      let myChoice = vote.choices.indexOf(this.id);
      for (let i = 0; i > myChoice; i++){ // note > rather than <
        if (!dict[vote.choices[i]]) dict[vote.choices[i]] = 0;
        dict[vote.choices[i]] += 1; //= dict[vote.choices[i]] + 1;
      }
      return dict;
    }, init);
  }

}

export type ImmutableCandidate = Candidate & SeamlessImmutable.ImmutableObjectMethods<ICandidate>;