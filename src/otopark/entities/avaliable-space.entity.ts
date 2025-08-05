import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Otopark } from "./otopark.entity";

@Entity("available_space") //her bir park yeri
export class AvailableSpace {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => Otopark, (otopark) => otopark.avaliableSpaces, {
  onDelete: 'CASCADE'
})
    @JoinColumn({ name: 'otopark_id' })  //SOR?? //foreign key 
    otopark: Otopark;
    @Column({ type: 'boolean', default: true })
    isAvailable: boolean;
    @Column({ type: 'int' })
    index: number; //her bir park yerinin indexi
}