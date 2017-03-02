/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.app.model;

import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Lucas
 */
@Entity
@Table(name = "venda_item")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "VendaItem.findAll", query = "SELECT v FROM VendaItem v"),
    @NamedQuery(name = "VendaItem.findById", query = "SELECT v FROM VendaItem v WHERE v.id = :id"),
    @NamedQuery(name = "VendaItem.findByValor", query = "SELECT v FROM VendaItem v WHERE v.valor = :valor"),
    @NamedQuery(name = "VendaItem.findByQuantidade", query = "SELECT v FROM VendaItem v WHERE v.quantidade = :quantidade")})
public class VendaItem implements Serializable {

    private static final long serialVersionUID = 1L;
    @SequenceGenerator(name = "venda_item_seq", sequenceName="venda_item_seq",initialValue = 1, allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Id
    @Column(name = "id")
    private Long id;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Basic(optional = false)
    @NotNull
    @Column(name = "valor")
    private BigDecimal valor;

    @Basic(optional = false)
    @NotNull
    @Column(name = "quantidade")
    private long quantidade;

    @JoinColumn(name = "id_produto", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Produto idProduto;

    @JoinColumn(name = "id_venda", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Venda idVenda;

    public VendaItem() {
    }

    public VendaItem(Long id) {
        this.id = id;
    }

    public VendaItem(Long id, BigDecimal valor, long quantidade) {
        this.id = id;
        this.valor = valor;
        this.quantidade = quantidade;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public long getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(long quantidade) {
        this.quantidade = quantidade;
    }

    public Produto getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Produto idProduto) {
        this.idProduto = idProduto;
    }

    public Venda getIdVenda() {
        return idVenda;
    }

    public void setIdVenda(Venda idVenda) {
        this.idVenda = idVenda;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof VendaItem)) {
            return false;
        }
        VendaItem other = (VendaItem) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "br.com.app.model.VendaItem[ id=" + id + " ]";
    }

}
