import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AvailableSpace } from "./avaliable-space.entity";

@Entity() //içine 'otopark' ekleyecek miyiz
export class Otopark {
    @PrimaryGeneratedColumn() //otomatşk artan
    id: number;
    @Column({ type: 'varchar', length: 100 })
    name: string;
    @Column({ type: 'varchar', length: 100 })
    location: string;
    @Column({ type: 'int' })
    capacity: number;
    @OneToMany(() => AvailableSpace, (space) => space.otopark,{
      onDelete: 'CASCADE' 

    }) 

    avaliableSpaces: AvailableSpace[]

}
