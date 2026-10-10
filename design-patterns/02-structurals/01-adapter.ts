/**
 * ! Patrón Adapter
 *  Permite que objetos con interfaces incompatibles trabajen juntos, también es muy
 *  util para utilizar librerías de terceros en nuestra aplicación sin depender
 *  directamente de ellas.
 *
 * * Es útil cuando se quiere reutilizar una clase que no tiene la interfaz que
 * * necesitamos o cuando queremos crear una capa de abstracción para una librería
 * * de terceros.
 *
 * https://refactoring.guru/es/design-patterns/adapter
 *
 *
 * la utilidad de este patrón es enorme ya que te permite crear esa clase adapter
 * que vas a usar en todo tu código en un lugar concreto y SOLO ahí es donde
 * la librería de terceros escucha tu código.
 *
 * tu código escucha esta clase adapter pero nunca la librería por lo qeu cambiar
 * la librería por otra sin tocar el código fuente es muy útil. solo tienes que adaptar
 * la nueva al adapter que ya tienes creado para que no se rompa nada
 */
